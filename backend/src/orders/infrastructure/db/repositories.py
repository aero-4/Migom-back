import logging
from typing import List

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.core.domain.exceptions import AlreadyExists, NotFound
from src.orders.domain.entities import OrderCreate, Order
from src.orders.domain.interfaces.order_repo import IOrderRepository
from src.orders.infrastructure.db.orm import OrdersOrm, OrderProductsOrm
from src.products.infrasctructure.db.orm import ProductsOrm


class PGOrdersRepository(IOrderRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, order_data: OrderCreate) -> Order:
        obj: OrdersOrm = OrdersOrm(**order_data.model_dump(exclude={"products"}))
        self.session.add(obj)

        try:
            await self.session.flush()
        except Exception as ex:
            logging.exception(ex, exc_info=True)
            raise AlreadyExists()

        await self._create_links(order_data, obj)

        result = await self.session.execute(
            select(OrdersOrm).options(selectinload(OrdersOrm.product_links)).where(OrdersOrm.id == obj.id)
        )
        order_data: OrdersOrm = result.scalar_one_or_none()
        if not order_data:
            raise NotFound()

        return self._to_entity(order_data)

    async def _create_links(self, order_data: OrderCreate, obj: OrdersOrm):
        product_ids = [item.product_id for item in order_data.products]
        stmt = select(ProductsOrm).where(ProductsOrm.id.in_(product_ids))
        result = await self.session.execute(stmt)
        products: List[ProductsOrm] = result.scalars().all()

        links: List[OrderProductsOrm] = []
        total: int = 0

        for item in order_data.products:
            product = next((p for p in products if p.id == item.product_id), None)

            if not product:
                raise NotFound(detail=f"Product with id {item.product_id} not found")

            link = OrderProductsOrm(
                order_id=obj.id,
                product_id=product.id,
                quantity=item.quantity,
                amount=product.price
            )
            links.append(link)
            total += item.quantity * product.price

        self.session.add_all(links)

        obj.amount = total
        self.session.add(obj)

        try:
            await self.session.flush()
        except Exception as ex:
            logging.error(ex, exc_info=True)
            raise AlreadyExists() from ex

    async def get(self, id: int) -> Order:
        obj: OrdersOrm | None = await self.session.get(OrdersOrm, OrdersOrm.id == id)

        if not obj:
            raise NotFound()

        return self._to_entity(obj)

    async def get_all(self) -> list[Order]:
        stmt = select(OrdersOrm)
        result = await self.session.execute(stmt)
        objs: list[OrdersOrm] = result.scalars().unique().all()

        return [self._to_entity(obj) for obj in objs]

    async def delete(self, id: int) -> None:
        obj: OrdersOrm | None = await self.session.get(OrdersOrm, OrdersOrm.id == id)

        if not obj:
            raise NotFound()

        await self.session.delete(obj)
        await self.session.flush()

    @staticmethod
    def _to_entity(order_data: OrdersOrm) -> Order:
        return Order(
            id=order_data.id,
            creator_id=order_data.creator_id,
            created_at=order_data.created_at,
            update_at=order_data.updated_at,
            products=[link.product_id for link in order_data.product_links],
            status=order_data.status,
            delivery_address=order_data.delivery_address,
            amount=order_data.amount
        )
