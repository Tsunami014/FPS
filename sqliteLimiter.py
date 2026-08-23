"""
This file only needs to be imported to be able to use sqlite:// urls in flask's rate limiter!
"""

import sqlite3
import threading
import time
from typing import Tuple, Type, Union
from urllib.parse import parse_qs, urlparse

from limits.storage import Storage

def register() -> None: ... # No-op to stop the import being flagged as unused

class SqliteStorage(Storage):
    """Fixed-window rate limit storage backed by a local SQLite file."""

    STORAGE_SCHEME = ["sqlite"]

    def __init__(self, uri: str, **options) -> None:
        super().__init__(uri, **options)
        # sqlite:///relative/path.db -> netloc="" path="/relative/path.db"
        # sqlite:////abs/path.db     -> netloc="" path="//abs/path.db"
        parsed = urlparse(uri)
        path = parsed.path
        if not path.startswith("//"):
            # relative path case: strip the single leading slash
            path = path.lstrip("/")
        self.path = path or ":memory:"

        query = parse_qs(parsed.query)
        self.cleanup_interval = float(
            options.get("cleanup_interval", query.get("cleanup_interval", [3600])[0])
        )

        self._local = threading.local()
        self._init_db()

        self._stop_cleanup = threading.Event()
        self._cleanup_thread = threading.Thread(
            target=self._cleanup_loop, daemon=True, name="sqlite-limiter-cleanup"
        )
        self._cleanup_thread.start()

    def _cleanup_loop(self) -> None:
        while not self._stop_cleanup.wait(self.cleanup_interval):
            try:
                conn = sqlite3.connect(self.path, timeout=30)
                conn.execute(
                    "DELETE FROM rate_limits WHERE expiry <= ?", (time.time(),)
                )
                conn.commit()
                conn.close()
            except sqlite3.Error:
                # Don't let a transient DB error kill the background thread.
                pass

    def __del__(self) -> None:
        stop = getattr(self, "_stop_cleanup", None)
        if stop is not None:
            stop.set()

    @property
    def _conn(self) -> sqlite3.Connection:
        conn = getattr(self._local, "conn", None)
        if conn is None:
            conn = sqlite3.connect(self.path, timeout=30, isolation_level=None)
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA busy_timeout=30000")
            self._local.conn = conn
        return conn

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.path, timeout=30)
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS rate_limits (
                key TEXT PRIMARY KEY,
                counter INTEGER NOT NULL,
                expiry REAL NOT NULL
            )
            """
        )
        conn.commit()
        conn.close()

    @property
    def base_exceptions(self) -> Union[Type[Exception], Tuple[Type[Exception], ...]]:
        return sqlite3.Error

    def incr(self, key: str, expiry: int, elastic_expiry: bool = False, amount: int = 1) -> int:
        now = time.time()
        conn = self._conn
        conn.execute("BEGIN IMMEDIATE")
        try:
            row = conn.execute(
                "SELECT counter, expiry FROM rate_limits WHERE key = ?", (key,)
            ).fetchone()

            if row is None or row[1] <= now:
                new_expiry = now + expiry
                conn.execute(
                    "INSERT INTO rate_limits (key, counter, expiry) VALUES (?, ?, ?) "
                    "ON CONFLICT(key) DO UPDATE SET counter = excluded.counter, "
                    "expiry = excluded.expiry",
                    (key, amount, new_expiry),
                )
                result = amount
            else:
                new_counter = row[0] + amount
                new_expiry = now + expiry if elastic_expiry else row[1]
                conn.execute(
                    "UPDATE rate_limits SET counter = ?, expiry = ? WHERE key = ?",
                    (new_counter, new_expiry, key),
                )
                result = new_counter
            conn.execute("COMMIT")
            return result
        except Exception:
            conn.execute("ROLLBACK")
            raise

    def get(self, key: str) -> int:
        row = self._conn.execute(
            "SELECT counter, expiry FROM rate_limits WHERE key = ?", (key,)
        ).fetchone()
        if row is None or row[1] <= time.time():
            return 0
        return row[0]

    def get_expiry(self, key: str) -> int:
        row = self._conn.execute(
            "SELECT expiry FROM rate_limits WHERE key = ?", (key,)
        ).fetchone()
        return int(row[0]) if row else int(time.time())

    def check(self) -> bool:
        try:
            self._conn.execute("SELECT 1")
            return True
        except sqlite3.Error:
            return False

    def reset(self) -> int:
        cur = self._conn.execute("DELETE FROM rate_limits")
        return cur.rowcount if cur.rowcount is not None else 0

    def clear(self, key: str) -> None:
        self._conn.execute("DELETE FROM rate_limits WHERE key = ?", (key,))
