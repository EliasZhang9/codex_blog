from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.errors import not_found
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.profile import ProfileComment, ProfileOut, ProfilePost

router = APIRouter()


@router.get("/users/{username}", response_model=ProfileOut)
def get_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise not_found("User not found")

    posts = db.query(Post).filter(Post.author_id == user.id).order_by(Post.created_at.desc()).all()
    comments = (
        db.query(Comment).filter(Comment.author_id == user.id).order_by(Comment.created_at.desc()).all()
    )

    return ProfileOut(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        posts_count=len(posts),
        comments_count=len(comments),
        recent_posts=[ProfilePost(id=p.id, title=p.title, created_at=p.created_at) for p in posts[:5]],
        recent_comments=[
            ProfileComment(id=c.id, content=c.content, created_at=c.created_at, post_id=c.post_id)
            for c in comments[:5]
        ],
    )

