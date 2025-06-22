import sqlite3

def get_db_connection():
    conn = sqlite3.connect('attendance.db')
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn
