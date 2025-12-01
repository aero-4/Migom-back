from src.orders.domain.entities import Order
from src.orders.presentation.dtos import OrderCreateDTO
from src.payments.domain.entities import PaymentCreate
from src.payments.domain.interfaces.payment_provider import IPaymentProvider
from src.payments.presentation.dependenscies import PaymentUoWDeps


async def add_payment(order: Order, uow: PaymentUoWDeps, provider: IPaymentProvider, method: str = "yoomoney"):
    payment = PaymentCreate(amount=order.amount,
                            order_id=order.id,
                            payment_method=method,
                            label=f"Оплата заказа: {order.id}")

    async with uow:
        payment_url: str = await provider.create(payment)
        payment.url = payment_url

        payment_created = await uow.payments.add(payment)

    return payment_created
