from __future__ import annotations
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.errors import bad_request, unauthorized
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import LoginInput, TokenOut
from app.schemas.user import BmrUpdate, UserCreate, UserOut

router = APIRouter()


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    email_exists = db.query(User).filter(User.email == payload.email).first()
    if email_exists:
        raise bad_request("Email is already registered", code="email_taken")

    username_exists = db.query(User).filter(User.username == payload.username).first()
    if username_exists:
        raise bad_request("Username is already taken", code="username_taken")

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        avatar_url=f"https://api.dicebear.com/9.x/fun-emoji/svg?seed={payload.username}",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(payload: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise unauthorized("Email or password is incorrect")

    token = create_access_token(user.id)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.put("/me/bmr", response_model=UserOut)
def update_bmr(payload: BmrUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.bmr_value = payload.bmr
    current_user.bmr_inputs = payload.inputs
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)

