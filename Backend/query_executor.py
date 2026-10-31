# Backend/query_executor.py
from database import get_sample_connection
from app_db import get_app_connection

MAX_ROWS = 200


def execute_query(sql_query):
    conn = get_sample_connection()
    cursor = conn.cursor()
    cursor.execute(sql_query)

    columns = [description[0] for description in cursor.description] if cursor.description else []
    rows = [dict(row) for row in cursor.fetchmany(MAX_ROWS)]

    conn.close()
    return {"columns": columns, "rows": rows, "row_count": len(rows)}

def log_history(natural_language, sql_query, result_count):
    conn = get_app_connection()
    conn.execute(
        "INSERT INTO query_history (natural_language, sql_query, result_count) VALUES (?, ?, ?)",
        (natural_language, sql_query, result_count),
    )
    conn.commit()
    conn.close()