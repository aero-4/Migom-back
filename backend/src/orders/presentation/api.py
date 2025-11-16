from fastapi import APIRouter

from src.orders.application.use_cases.new_order import new_order
from src.orders.presentation.dependencies import OrderUoWDeps
from src.orders.presentation.dtos import OrderCreateDTO

orders_api_router = APIRouter()


@orders_api_router.post("/")
async def create_order(order: OrderCreateDTO, uow: OrderUoWDeps):
    return await new_order(order, uow)
