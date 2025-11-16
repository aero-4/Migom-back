from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.domain.exceptions import AlreadyExists, NotFound
from src.orders.domain.entities import OrderCreate, Order
from src.orders.domain.interfaces.order_repo import IOrderRepository
from src.orders.infrastructure.db.orm import OrdersOrm


class PGOrdersRepository(IOrderRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, order: OrderCreate) -> Order:
        obj: OrdersOrm = OrdersOrm(**order.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except:
            raise AlreadyExists()

        return self._to_entity(obj)

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
            created_at=order_data.created_at,
            update_at=order_data.update_at,
            products=order_data.products,
            status=order_data.status,
            delivery_address=order_data.delivery_address,
            amount=order_data.amount
        )
