from __future__ import annotations
from datetime import datetime
from typing import Optional

from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    username: str
    email: EmailStr
    bmr_value: Optional[int] = Field(default=None, ge=0)
    bmr_inputs: Optional[Dict[str, Any]] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    avatar_url: Optional[str] = None
    created_at: datetime


class BmrUpdate(BaseModel):
    bmr: int = Field(..., ge=0)
    inputs: Optional[Dict[str, Any]] = None
