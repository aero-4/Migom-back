from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import TokenAuthDep
from src.auth.presentation.permissions import access_control
from src.orders.domain.entities import Order
from src.payments.application.use_cases.add_payment import add_payment
from src.payments.application.use_cases.collect_payments import get_payment, collect_payments
from src.payments.presentation.dependenscies import PaymentUoWDeps, PaymentProviderDeps
from src.payments.presentation.dtos import PaymentCreateDTO

payments_api_router = APIRouter()


@payments_api_router.post("/")
async def add(payment_data: PaymentCreateDTO, payment: PaymentUoWDeps, provider: PaymentProviderDeps, auth: TokenAuthDep):
    print(payment_data, payment)
    return await add_payment(payment_data, payment, provider)


@payments_api_router.get("/{payment_id}")
async def get(payment_id: int, payment: PaymentUoWDeps, provider: PaymentProviderDeps, auth: TokenAuthDep):
    return await get_payment(payment_id, payment, provider)


@access_control(superuser=True)
@payments_api_router.get("/")
async def get_all(auth: TokenAuthDep, payment: PaymentUoWDeps):
    return await collect_payments(payment)
