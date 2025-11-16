from src.orders.domain.entities import Order, OrderCreate
from src.orders.domain.interfaces.order_uow import IOrderUnitOfWork
from src.orders.presentation.dtos import OrderCreateDTO


async def new_order(order: OrderCreateDTO, uow: IOrderUnitOfWork) -> Order:
    async with uow:
        order = OrderCreate(**order.model_dump())
        order = await uow.orders.add(order)
        await uow.commit()
    return order
