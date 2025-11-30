import datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.utils.datetimes import get_timezone_now


class PaymentsStatus(StrEnum):
    created = "created"
    waiting = "waiting"
    success = "success"
    expired = "expired"


class PaymentsOrm:
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=get_timezone_now, default=get_timezone_now)
    amount: Mapped[int] = mapped_column(nullable=False)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    payment_method: Mapped[str] = mapped_column(nullable=False)
    url: str | None = None
    status: Mapped[str] = mapped_column(nullable=False, default=PaymentsStatus.created)