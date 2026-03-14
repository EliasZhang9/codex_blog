from __future__ import annotations
from pydantic import BaseModel, EmailStr

from app.schemas.user import UserOut


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

