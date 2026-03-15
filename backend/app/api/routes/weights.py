from __future__ import annotations
from datetime import date

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.weight_entry import WeightEntry
from app.schemas.weight import WeightEntryOut, WeightEntryUpsert

router = APIRouter()


@router.get("/weights/me", response_model=list[WeightEntryOut])
def list_my_weights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = (
        db.query(WeightEntry)
        .filter(WeightEntry.user_id == current_user.id)
        .order_by(WeightEntry.entry_date.asc())
        .all()
    )
    return [WeightEntryOut(entry_date=e.entry_date, weight_kg=e.weight_kg) for e in entries]


@router.put("/weights/me/{entry_date}", response_model=WeightEntryOut)
def upsert_my_weight(
    entry_date: date,
    payload: WeightEntryUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(WeightEntry)
        .filter(WeightEntry.user_id == current_user.id, WeightEntry.entry_date == entry_date)
        .first()
    )
    if entry:
        entry.weight_kg = payload.weight_kg
    else:
        entry = WeightEntry(user_id=current_user.id, entry_date=entry_date, weight_kg=payload.weight_kg)
        db.add(entry)

    db.commit()
    db.refresh(entry)
    return WeightEntryOut(entry_date=entry.entry_date, weight_kg=entry.weight_kg)


@router.delete("/weights/me/{entry_date}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_weight(
    entry_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(WeightEntry)
        .filter(WeightEntry.user_id == current_user.id, WeightEntry.entry_date == entry_date)
        .first()
    )
    if entry:
        db.delete(entry)
    db.commit()
    return None
