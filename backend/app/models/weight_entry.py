from __future__ import annotations
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class WeightEntry(Base):
    __tablename__ = "weight_entries"
    __table_args__ = (UniqueConstraint("user_id", "entry_date", name="uq_weight_entries_user_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entry_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="weight_entries")
