# Backend/summarizer.py
import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise RuntimeError("GOOGLE_API_KEY is not set — check Backend/.env")

llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", temperature=0.3)

PROMPT_TEMPLATE = """A user asked: "{question}"

The query returned {row_count} row(s) with columns: {columns}.
Here are up to 10 sample rows: {preview}

Write a single short sentence (max 30 words) summarizing what the results show.
Describe the pattern or answer the question — do not just repeat the raw data."""


def summarize_results(question, columns, rows):
    if not rows:
        return "The query returned no rows."

    preview = rows[:10]
    prompt = PROMPT_TEMPLATE.format(
        question=question,
        row_count=len(rows),
        columns=", ".join(columns),
        preview=preview,
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    content = response.content
    if isinstance(content, list):
        text = "".join(
            part.get("text", "") if isinstance(part, dict) else str(part)
            for part in content
        )
    else:
        text = str(content)
    return text.strip()