from __future__ import annotations
from datetime import date

from pydantic import BaseModel, Field


class WeightEntryUpsert(BaseModel):
    weight_kg: float = Field(gt=0)


class WeightEntryOut(BaseModel):
    entry_date: date
    weight_kg: float
