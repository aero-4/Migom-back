from typing import List

from src.core.domain.entities import CustomModel


class CartItemDTO(CustomModel):
    product_id: int
    quantity: int


class OrderCreateDTO(CustomModel):
    delivery_address: str
    products: List[CartItemDTO]


class OrderUpdateDTO(CustomModel):
    status: str | None = None
    amount: int | None = None
    delivery_address: str | None = None
