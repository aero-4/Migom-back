from src.orders.domain.entities import Order
from src.orders.presentation.dtos import OrderCreateDTO
from src.payments.domain.entities import PaymentCreate
from src.payments.presentation.dependenscies import PaymentUoWDeps


async def add_payment(order: Order, uow: PaymentUoWDeps, method: str):
    payment = PaymentCreate(amount=order.amount, order_id=order.id, payment_method=method)

    async with uow:
        payment = await uow.payments.add(order)

    return payment