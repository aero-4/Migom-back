from src.orders.domain.entities import OrderUpdate, Order
from src.orders.presentation.dependencies import OrderUoWDeps
from src.orders.presentation.dtos import OrderUpdateDTO


async def update_order(id: int, order_data: OrderUpdateDTO, uow: OrderUoWDeps) -> Order:
    async with uow:
        order = OrderUpdate(id=id, **order_data.model_dump())
        order = await uow.orders.update(order)
        await uow.commit()
    return order
