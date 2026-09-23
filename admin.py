import sqlite3
import requests
import hashlib
import time
import math
import threading
import random

DB_PATH = 'main.db'
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
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        git_url TEXT,
        hkt_projects TEXT
    );
    CREATE TABLE IF NOT EXISTS ships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        proj_id INTEGER NOT NULL,
        description TEXT,
        demo_url TEXT,
        status TEXT,
        fulfilled INTEGER
    );
    CREATE TABLE IF NOT EXISTS devlogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ship_id INTEGER NOT NULL,
        description TEXT,
        image_url TEXT,
        status TEXT
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

def getUserProjects(userid):
    if userid is None:
        return None
    conn = get_conn()
    projs = []
    for proj in conn.execute(
        "SELECT * FROM projects WHERE user_id = ?", (userid,)
    ).fetchall():
        ships = []
        for ship in conn.execute(
            "SELECT * FROM ships WHERE proj_id = ?", (proj['id'],)
        ).fetchall():
            devlogs = conn.execute(
                "SELECT * FROM devlogs WHERE ship_id = ?", (ship['id'],)
            ).fetchall()
            pass
        projs.append({
            "id": proj['id'],
            "title": proj['title'],
            "hackatime_projects": proj['hkt_projects'],
            "git_url": proj['git_url'],
            "ships": ships
        })
    return projs

ADJS = [
    "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
    "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
    "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
    "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
    "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
    "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
    "wandering", "withered", "wild", "black", "young", "holy", "solitary",
    "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
    "polished", "ancient", "purple", "lively", "nameless"
]
NOUNS = [
    "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
    "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
    "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
    "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
    "feather", "grass", "haze", "mountain", "night", "pond", "darkness",
    "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
    "violet", "water", "wildflower", "wave", "water", "resonance", "sun",
    "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
    "frog", "smoke", "star"
]
def newProject(userid):
    if userid is None:
        return None
    conn = get_conn()
    conn.execute(
        "INSERT INTO projects (user_id, title) VALUES (?, ?)",
        (userid, random.choice(ADJS) + "_" + random.choice(NOUNS))
    )
    conn.commit()


def format(js):
    return js
