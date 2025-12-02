from src.orders.domain.entities import Order
from src.orders.presentation.dtos import OrderCreateDTO
from src.payments.domain.entities import PaymentCreate, Payment
from src.payments.domain.interfaces.payment_provider import IPaymentProvider
from src.payments.presentation.dependenscies import PaymentUoWDeps
from src.payments.presentation.dtos import PaymentCreateDTO


async def add_payment(payment_data: PaymentCreateDTO, uow: PaymentUoWDeps, provider: IPaymentProvider) -> Payment:
    print(payment_data)
    payment_data = PaymentCreate(amount=payment_data.amount,
                                 order_id=payment_data.id,
                                 method=payment_data.method,
                                 label=f"Оплата заказа: {payment_data.id}")
    print(payment_data)
    async with uow:
        payment_url: str = await provider.create(payment_data)
        payment_data.url = payment_url

        payment = await uow.payments.add(payment_data)
    return payment
