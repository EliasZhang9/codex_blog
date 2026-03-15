from __future__ import annotations
from fastapi import APIRouter

from app.api.routes import auth, comments, posts, users, weights

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(posts.router, tags=["posts"])
api_router.include_router(comments.router, tags=["comments"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(weights.router, tags=["weights"])
