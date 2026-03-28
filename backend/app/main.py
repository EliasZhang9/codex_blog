from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.api import api_router
from app.core.config import settings
from app.db.init_db import Base
from app.db.session import engine

def _apply_sqlite_migrations():
    """
    Lightweight migration to add new columns when running on existing SQLite DBs.
    Avoids runtime crashes when the users table already exists without new columns.
    """
    inspector = inspect(engine)
    columns = {col["name"] for col in inspector.get_columns("users")}
    ddl: list[str] = []
    if "bmr_value" not in columns:
        ddl.append("ALTER TABLE users ADD COLUMN bmr_value INTEGER")
    if "bmr_inputs" not in columns:
        ddl.append("ALTER TABLE users ADD COLUMN bmr_inputs JSON")
    if not ddl:
        return
    with engine.begin() as conn:
        for stmt in ddl:
            conn.execute(text(stmt))


Base.metadata.create_all(bind=engine)
_apply_sqlite_migrations()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Playful Forum API is alive"}

