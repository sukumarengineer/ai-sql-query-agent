from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app_db import init_app_database
from database import init_sample_database
from routes import database, queries

app = FastAPI(title="SQL Query Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_sample_database()
init_app_database()

app.include_router(queries.router)
app.include_router(database.router)


@app.get("/health")
def health():
    return {"status": "ok"}