import datetime
from typing import List

from src.core.domain.entities import CustomModel


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
    products: List[int]
    delivery_address: str
    amount: int
    delivery_address: str


