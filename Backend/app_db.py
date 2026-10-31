# Backend/app_db.py
import sqlite3
from pathlib import Path

APP_DB_PATH = Path(__file__).parent / "app_data.db"


def get_app_connection():
    conn = sqlite3.connect(APP_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_app_database():
    conn = get_app_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS saved_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            natural_language TEXT NOT NULL,
            sql_query TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS query_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            natural_language TEXT,
            sql_query TEXT NOT NULL,
            result_count INTEGER NOT NULL,
            executed_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()