# Backend/routes/database.py
from fastapi import APIRouter

from database import get_schema_info

router = APIRouter(prefix="/api/database")


@router.get("/schema")
def schema():
    return get_schema_info()