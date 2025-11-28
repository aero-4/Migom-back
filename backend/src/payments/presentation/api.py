from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import TokenAuthDep
from src.orders.domain.entities import Order
from src.orders.presentation.dtos import OrderCreateDTO
from src.payments.application.use_cases.add_payment import add_payment
from src.payments.application.use_cases.get_callback import get_payment_callback

payments_api_router = APIRouter()


@payments_api_router.post("/{method}")
async def add(method: str, order: Order, auth: TokenAuthDep):
    return await add_payment(order, auth, method)


@payments_api_router.callbacks("/callback")
async def callback(request: Request, auth: TokenAuthDep):
    return await get_payment_callback(request)


@payments_api_router.get("/{order_id}")
async def get_all(order_id: int):
    return {"msg": "Payment get all"}


@payments_api_router.patch("/{order_id}")
async def update(order_id: int):
    return {"msg": "Payment updated"}


@payments_api_router.delete("/{order_id}")
async def delete(order_id: int):
    return {"msg": "Payment deleted"}
