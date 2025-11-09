import abc
from typing import List

from src.products.domain.entities import Product, ProductCreate


class IProductRepository(abc.ABC):

    @abc.abstractmethod
    async def get_all(self) -> List[Product]:
        ...

    @abc.abstractmethod
    async def get_one(self, id: int) -> Product:
        ...

    @abc.abstractmethod
    async def add(self, product: ProductCreate) -> Product:
        ...