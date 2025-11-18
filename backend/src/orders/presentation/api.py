from fastapi import APIRouter

from src.orders.application.use_cases.collect_orders import collect_order, collect_orders
from src.orders.application.use_cases.delete_order import delete_order
from src.orders.application.use_cases.new_order import new_order
from src.orders.application.use_cases.update_order import update_order
from src.orders.presentation.dependencies import OrderUoWDeps
from src.orders.presentation.dtos import OrderCreateDTO, OrderUpdateDTO

orders_api_router = APIRouter()


@orders_api_router.post("/")
async def create(order: OrderCreateDTO, uow: OrderUoWDeps):
    return await new_order(order, uow)


@orders_api_router.delete("/{id}")
async def delete(id: int, uow: OrderUoWDeps):
    return await delete_order(id, uow)


@orders_api_router.get("/{id}")
async def get_one(id: int, uow: OrderUoWDeps):
    return await collect_order(id, uow)


@orders_api_router.get("/")
async def get_all(uow: OrderUoWDeps):
    return await collect_orders(uow)


@orders_api_router.patch("/{id}")
async def update(id: int, order: OrderUpdateDTO, uow: OrderUoWDeps):
    return await update_order(id, order, uow)