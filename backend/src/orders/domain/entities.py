import datetime
import enum
from typing import List

from src.core.domain.entities import CustomModel


class OrderStatus(enum.Enum):
    CREATED = "created"
    PENDING = "pending"
    DELIVERING = "delivering"
    SUCCESS = "success"
    ERROR = "error"


class CartItem(CustomModel):
    product_id: int
    quantity: int


class Order(CustomModel):
    id: int
    created_at: datetime.datetime
    update_at: datetime.datetime
    creator_id: int
    products: List[int]
    status: str
    delivery_address: str
    amount: int


class OrderCreate(CustomModel):
    creator_id: int
    delivery_address: str
    products: List[CartItem]
