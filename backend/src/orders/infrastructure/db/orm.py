import datetime

from sqlalchemy import DateTime, ForeignKey, Enum, Table, Column, Integer, Float
from sqlalchemy.orm import mapped_column, Mapped, relationship

from src.db.base import Base
from src.orders.domain.entities import OrderStatus
from src.utils.datetimes import get_timezone_now


class OrderProductOrm(Base):
    __tablename__ = "order_products"

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)

    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    price_at_order: Mapped[float] = mapped_column(Float, nullable=False)

    # навигационные связи к родителям
    product: Mapped["ProductsOrm"] = relationship("ProductsOrm", back_populates="order_links")
    order: Mapped["OrdersOrm"] = relationship("OrdersOrm", back_populates="product_links")


class OrdersOrm(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=get_timezone_now, default=get_timezone_now)

    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.CREATED)
    delivery_address: Mapped[str | None] = mapped_column(nullable=True)
    amount: Mapped[int] = mapped_column(default=0)

    creator: Mapped['UsersOrm'] = relationship(back_populates="orders")
    creator_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

    products: Mapped[list['ProductsOrm']] = relationship(back_populates="orders", lazy="select", cascade="save-update")
    products_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=True)
