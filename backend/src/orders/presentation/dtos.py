from typing import List

from src.core.domain.entities import CustomModel


class CartItemDTO(CustomModel):
    product_id: int
    quantity: int


class OrderCreateDTO(CustomModel):
    creator_id: int
    delivery_address: str
    products: List[CartItemDTO]


class OrderUpdateDTO(CustomModel):
    creator_id: int
    products: List[CartItemDTO] | None = None
    status: str | None = None
    amount: int | None = None
    delivery_address: str | None = None
