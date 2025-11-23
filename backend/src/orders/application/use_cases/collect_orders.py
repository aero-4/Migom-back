from typing import List

from src.orders.domain.entities import Order
from src.orders.presentation.dependencies import OrderUoWDeps
from src.users.domain.entities import User


async def collect_order(id: int, uow: OrderUoWDeps) -> Order:
    async with uow:
        order = await uow.orders.get(id)
    return order


async def collect_orders(uow: OrderUoWDeps, user: User) -> List[Order]:
    async with uow:
        orders = await uow.orders.get_all(user.id)
    return orders
