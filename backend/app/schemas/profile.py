from __future__ import annotations
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProfilePost(BaseModel):
    id: int
    title: str
    created_at: datetime


class ProfileComment(BaseModel):
    id: int
    content: str
    created_at: datetime
    post_id: int


class ProfileOut(BaseModel):
    id: int
    username: str
    email: str
    avatar_url: Optional[str] = None
    created_at: datetime
    posts_count: int
    comments_count: int
    recent_posts: list[ProfilePost]
    recent_comments: list[ProfileComment]
