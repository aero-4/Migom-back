import pytest

from src.payments.application.use_cases.add_payment import add_payment
from src.payments.domain.entities import PaymentCreate
from src.payments.presentation.dependenscies import PaymentUoWDeps


@pytest.mark.asyncio
async def test_add_payment(payments_uow: PaymentUoWDeps):
    payment = PaymentCreate(amount=100, order_id=1, payment_method="yoomoney")
    payment_created = await add_payment(payment, payments_uow, "yoomoney", payments_uow.payments)
    assert payment_created.id