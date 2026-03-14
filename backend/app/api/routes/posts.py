from __future__ import annotations
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, get_db
from app.core.errors import forbidden, not_found
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostDetail, PostListItem, PostReactionOut, PostUpdate, ReactionCounts
from app.schemas.reaction import ReactionInput

router = APIRouter()


def _reaction_counts(post: Post) -> ReactionCounts:
    return ReactionCounts(
        fire=post.reaction_fire,
        laugh=post.reaction_laugh,
        mindblown=post.reaction_mindblown,
    )


def _list_item(post: Post) -> PostListItem:
    return PostListItem(
        id=post.id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author=post.author,
        comment_count=len(post.comments),
        reactions=_reaction_counts(post),
    )


def _detail(post: Post) -> PostDetail:
    comments_sorted = sorted(post.comments, key=lambda c: c.created_at)
    return PostDetail(
        id=post.id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author=post.author,
        comments=comments_sorted,
        reactions=_reaction_counts(post),
    )


@router.get("/posts", response_model=list[PostListItem])
def list_posts(db: Session = Depends(get_db)):
    posts = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.comments))
        .order_by(Post.created_at.desc())
        .all()
    )
    return [_list_item(post) for post in posts]


@router.get("/posts/{post_id}", response_model=PostDetail)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.comments).joinedload(Comment.author))
        .filter(Post.id == post_id)
        .first()
    )
    if not post:
        raise not_found("Post not found")
    return _detail(post)


@router.post("/posts", response_model=PostDetail, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = Post(title=payload.title, content=payload.content, author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    post = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.comments).joinedload(Comment.author))
        .filter(Post.id == post.id)
        .first()
    )
    return _detail(post)


@router.put("/posts/{post_id}", response_model=PostDetail)
def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise not_found("Post not found")
    if post.author_id != current_user.id:
        raise forbidden("Only the post author can edit this post")

    post.title = payload.title
    post.content = payload.content
    db.commit()

    refreshed = (
        db.query(Post)
        .options(joinedload(Post.author), joinedload(Post.comments).joinedload(Comment.author))
        .filter(Post.id == post_id)
        .first()
    )
    return _detail(refreshed)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise not_found("Post not found")
    if post.author_id != current_user.id:
        raise forbidden("Only the post author can delete this post")

    db.delete(post)
    db.commit()
    return None


@router.post("/posts/{post_id}/react", response_model=PostReactionOut)
def react_to_post(
    post_id: int,
    payload: ReactionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise not_found("Post not found")

    if payload.emoji == "fire":
        post.reaction_fire += 1
    elif payload.emoji == "laugh":
        post.reaction_laugh += 1
    else:
        post.reaction_mindblown += 1

    db.commit()
    db.refresh(post)
    return PostReactionOut(post_id=post.id, reactions=_reaction_counts(post))

