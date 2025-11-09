from typing import List, Any, Coroutine

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.domain.exceptions import AlreadyExists
from src.products.domain.entities import Product, ProductCreate
from src.products.domain.interfaces.product_repo import IProductRepository
from src.products.infrasctructure.db.orm import ProductsOrm


class PGProductsRepository(IProductRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def get_all(self) -> list[Product]:
        stmt = select(ProductsOrm)

        result = await self.session.execute(stmt)
        result = result.unique().scalars().all()
        return [
            self._to_domain(product) for product in result
        ]

    async def get_one(self, id: int) -> Product:
        stmt = select(ProductsOrm).where(ProductsOrm.id == id)

        result = await self.session.execute(stmt)
        obj: ProductsOrm = result.scalar_one_or_none()

        return self._to_domain(obj)


    async def add(self, product: ProductCreate) -> Product:
        obj = ProductsOrm(**product.model_dump(mode="python"))
        self.session.add(product)

        try:
            await self.session.flush()
        except IntegrityError:
            raise AlreadyExists()

        return self._to_domain(obj)


    @staticmethod
    def _to_domain(product: ProductsOrm):
        return Product(
            id=product.id,
            created_at=product.created_at,
            updated_at=product.updated_at,
            name=product.name,
            content=product.content,
            composition=product.composition,
            price=product.price,
            discount_price=product.discount_price,
            discount=product.discount,
            count=product.count,
            grams=product.grams,
            protein=product.protein,
            fats=product.fats,
            carbohydrates=product.carbohydrates,
            photo=product.photo,
            category_id=product.category_id,
            category=product.category
        )