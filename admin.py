import sqlite3
import requests
import hashlib
import time
import math
import threading

DB_PATH = 'users.db'
_local = threading.local()

def get_conn():
    conn = getattr(_local, 'conn', None)
    if conn is None:
        conn = sqlite3.connect(DB_PATH, timeout=5.0)
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.row_factory = sqlite3.Row
        _local.conn = conn
    return conn

# Run schema setup once, using its own short-lived connection
with sqlite3.connect(DB_PATH, timeout=5.0) as _setup:
    _setup.executescript('''
    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        hkt_id INTEGER NOT NULL,
        valid_thru INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hkt_id INTEGER UNIQUE NOT NULL,
        github_username TEXT,
        slack_id TEXT,
        emails TEXT,
        balance INTEGER NOT NULL DEFAULT 0
    );
    ''')

def hash_token(tok):
    return hashlib.sha256(tok.encode()).hexdigest()

def rememberUser(usr):
    conn = get_conn()
    conn.execute(
        """INSERT INTO users (hkt_id, github_username, slack_id, emails)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(hkt_id) DO UPDATE SET
             github_username = excluded.github_username,
             slack_id = excluded.slack_id,
             emails = excluded.emails""",
        (usr['id'], usr['github_username'], usr['slack_id'], '\n'.join(usr['emails'])),
    )
    conn.commit()

TIMEOUT = 60*60*24*30 # 30 days
def rememberToken(thash, id, now=None):
    conn = get_conn()
    conn.execute(
        """INSERT INTO sessions (token_hash, hkt_id, valid_thru)
           VALUES (?, ?, ?)
           ON CONFLICT(token_hash) DO UPDATE SET
             hkt_id = excluded.hkt_id,
             valid_thru = excluded.valid_thru""",
        (thash, id, (now or math.floor(time.time())) + TIMEOUT),
    )
    conn.commit()


def getUserId(token):
    conn = get_conn()
    thash = hash_token(token)
    now = math.floor(time.time())

    cached = conn.execute(
        "SELECT * FROM sessions WHERE token_hash = ?", (thash,)
    ).fetchone()

    if cached and cached["valid_thru"] > now:
        hkt_id = cached["hkt_id"]
    else:
        r = requests.get(
            "https://hackatime.hackclub.com/api/v1/authenticated/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        if r.status_code != 200:
            # bad/expired/revoked token
            conn.execute("DELETE FROM sessions WHERE token_hash = ?", (thash,))
            conn.commit()
            return None

        me = r.json()
        hkt_id = me["id"]
        rememberUser(me)
        rememberToken(thash, hkt_id, now)

    return hkt_id

def getUserInfo(id):
    if id is None:
        return None
    return get_conn().execute(
        "SELECT * FROM users WHERE hkt_id = ?", (id,)
    ).fetchone()


def format(js):
    return js
