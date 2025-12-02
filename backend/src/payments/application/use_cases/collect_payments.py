from typing import List

from src.auth.presentation.dependencies import TokenAuthDep
from src.payments.domain.entities import Payment, PaymentUpdate
from src.payments.domain.interfaces.payment_provider import IPaymentProvider
from src.payments.infrastructure.db.orm import PaymentsStatus
from src.payments.presentation.dependenscies import PaymentUoWDeps


async def get_payment(
        id: int,
        uow: PaymentUoWDeps,
        provider: IPaymentProvider,
) -> Payment:
    async with uow:
        payment = await uow.payments.get(id)
        status = PaymentsStatus.success if await provider.check_status(payment.label) else PaymentsStatus.waiting

        if status != payment.status:
            payment_update = PaymentUpdate(id=payment.id, status=status)
            payment.status = status

            await uow.payments.update(payment_update)


    return payment


async def collect_payments(
        uow: PaymentUoWDeps,
) -> List[Payment]:
    async with uow:
        payments = await uow.payments.get_all()
    return payments
