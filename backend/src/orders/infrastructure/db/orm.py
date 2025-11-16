import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.db.base import Base
from src.orders.domain.entities import OrderStatus
from src.utils.datetimes import get_timezone_now


class OrdersOrm(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    update_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=get_timezone_now, default=get_timezone_now)
    creator_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    creator: Mapped['UsersOrm'] = relationship(back_populates="users")
    products: Mapped[list['ProductsOrm']] = relationship(
        back_populates="order"
    )
    status: Mapped[OrderStatus]
    delivery_address: Mapped[str] = mapped_column(nullable=True)
    amount: Mapped[int] = mapped_column(default=0)
