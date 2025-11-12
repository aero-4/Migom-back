from typing import List

from src.products.domain.entities import ProductUpdate, Product, ProductCreate
from src.products.domain.interfaces.product_repo import IProductRepository
from src.products.domain.interfaces.product_uow import IProductUnitOfWork
from src.users.domain.exceptions import UserNotFound


class FakeProductRepository:
    def __init__(self):
        self._products = []
        self._last_user_id = 0

    async def add(self, product: ProductCreate) -> Product:
        product = Product(id=self._get_new_user_id(), **product.model_dump())
        self._products.append(product)
        return product

    def get_by_pk(self, pk: int) -> Product:
        for product in self._products:
            if product.id == pk:
                return product

        raise UserNotFound(detail=f"Product with id {pk} not found")

    async def get_all(self) -> List[Product]:
        return self._products

    async def get_one(self, id: int) -> Product:
        return self.get_by_pk(id)

    async def delete(self, id: int) -> None:
        product = await self.get_by_pk(id)
        self._products.remove(product)

    async def update(self, product_data: ProductUpdate) -> Product:
        product = await self.get_by_pk(product_data.id)

        for field, value in product_data.model_dump(exclude_unset=True).items():
            setattr(product, field, value)

        return product

    def _get_new_user_id(self) -> int:
        self._last_user_id += 1
        return self._last_user_id


class FakeProductUnitOfWork(IProductUnitOfWork):
    products: IProductRepository
    committed: bool

    def __init__(self):
        self.products = FakeProductRepository()
        self.committed = False

    async def _commit(self):
        self.committed = True

    async def rollback(self):
        pass