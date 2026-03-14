from __future__ import annotations
from enum import Enum

from pydantic import BaseModel


class ReactionType(str, Enum):
    fire = "fire"
    laugh = "laugh"
    mindblown = "mindblown"


class ReactionInput(BaseModel):
    emoji: ReactionType

