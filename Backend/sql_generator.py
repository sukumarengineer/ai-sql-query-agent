# Backend/sql_generator.py
import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise RuntimeError("GOOGLE_API_KEY is not set — check Backend/.env")

llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", temperature=0)


class SQLQueryResult(BaseModel):
    sql_query: str = Field(description="A single SQLite SELECT statement that answers the question")
    explanation: str = Field(description="A short, plain-English explanation of what the query does")

PROMPT_TEMPLATE = """You are a SQL expert. Convert the natural language question into a single SQLite SELECT query.

Database schema:
{schema_context}

Rules:
- Only generate SELECT statements. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or any other statement.
- Only use the tables and columns listed in the schema above.
- If the question cannot be answered with a SELECT query against this schema, write a query that returns no rows rather than guessing at columns that don't exist.

Question: {question}"""


def generate_sql_query(question, schema_context):
    prompt = PROMPT_TEMPLATE.format(schema_context=schema_context, question=question)
    structured_llm = llm.with_structured_output(SQLQueryResult)
    return structured_llm.invoke([HumanMessage(content=prompt)])

UNSAFE_KEYWORDS = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
    "CREATE", "TRUNCATE", "ATTACH", "PRAGMA", "REPLACE",
]


def validate_query_safety(sql_query):
    normalized = sql_query.strip().upper()

    if not normalized.startswith("SELECT"):
        return False, "Only SELECT queries are allowed."

    for keyword in UNSAFE_KEYWORDS:
        if keyword in normalized:
            return False, f"Query contains a disallowed keyword: {keyword}"

    if ";" in sql_query.strip().rstrip(";"):
        return False, "Multiple statements are not allowed."

    return True, ""