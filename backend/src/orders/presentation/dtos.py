from typing import List

from src.core.domain.entities import CustomModel


class OrderCreateDTO(CustomModel):
    creator_id: int
    products: List[int]
    delivery_address: str
    amount: int
    status: str
