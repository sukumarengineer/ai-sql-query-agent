# Backend/routes/queries.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app_db import get_app_connection
from database import build_schema_context, get_schema_info
from query_executor import execute_query, log_history
from sql_generator import generate_sql_query, validate_query_safety
from summarizer import summarize_results

router = APIRouter(prefix="/api/queries")


class GenerateRequest(BaseModel):
    question: str


class ExecuteRequest(BaseModel):
    sql_query: str
    natural_language: str | None = None


class SaveRequest(BaseModel):
    natural_language: str
    sql_query: str
    title: str | None = None


@router.post("/generate")
def generate(request: GenerateRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    schema_context = build_schema_context(get_schema_info())

    try:
        result = generate_sql_query(request.question, schema_context)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"SQL generation failed: {e}")

    is_safe, reason = validate_query_safety(result.sql_query)
    if not is_safe:
        raise HTTPException(status_code=422, detail=f"Generated query was rejected: {reason}")

    return {"sql_query": result.sql_query, "explanation": result.explanation}


@router.post("/execute")
def execute(request: ExecuteRequest):
    is_safe, reason = validate_query_safety(request.sql_query)
    if not is_safe:
        raise HTTPException(status_code=422, detail=reason)

    try:
        result = execute_query(request.sql_query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SQL error: {e}")

    log_history(request.natural_language, request.sql_query, result["row_count"])

    try:
        summary = summarize_results(
            request.natural_language or request.sql_query, result["columns"], result["rows"]
        )
    except Exception:
        summary = None

    return {**result, "summary": summary}


@router.post("/save")
def save(request: SaveRequest):
    if not request.sql_query.strip() or not request.natural_language.strip():
        raise HTTPException(status_code=400, detail="natural_language and sql_query are required.")

    conn = get_app_connection()
    cursor = conn.execute(
        "INSERT INTO saved_queries (title, natural_language, sql_query) VALUES (?, ?, ?)",
        (request.title, request.natural_language, request.sql_query),
    )
    conn.commit()
    saved_id = cursor.lastrowid
    row = conn.execute("SELECT * FROM saved_queries WHERE id = ?", (saved_id,)).fetchone()
    conn.close()
    return dict(row)


@router.get("")
def list_saved():
    conn = get_app_connection()
    rows = conn.execute("SELECT * FROM saved_queries ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.get("/history")
def history():
    conn = get_app_connection()
    rows = conn.execute("SELECT * FROM query_history ORDER BY executed_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@router.get("/{query_id}")
def get_saved(query_id: int):
    conn = get_app_connection()
    row = conn.execute("SELECT * FROM saved_queries WHERE id = ?", (query_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Saved query not found.")
    return dict(row)


@router.post("/{query_id}/execute")
def rerun(query_id: int):
    conn = get_app_connection()
    row = conn.execute("SELECT * FROM saved_queries WHERE id = ?", (query_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Saved query not found.")

    saved = dict(row)
    result = execute_query(saved["sql_query"])
    log_history(saved["natural_language"], saved["sql_query"], result["row_count"])
    return result


@router.delete("/{query_id}")
def delete(query_id: int):
    conn = get_app_connection()
    row = conn.execute("SELECT * FROM saved_queries WHERE id = ?", (query_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Saved query not found.")

    conn.execute("DELETE FROM saved_queries WHERE id = ?", (query_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Query deleted."}