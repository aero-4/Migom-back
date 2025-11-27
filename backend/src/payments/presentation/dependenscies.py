from typing import Annotated

from fastapi import Depends

from src.payments.domain.interfaces.payment_uow import IPaymentUnitOfWork
from src.payments.infrastructure.db.unit_of_work import PGPaymentUnitOfWork


def get_payment_uow() -> IPaymentUnitOfWork:
    return PGPaymentUnitOfWork()


PaymentUoWDeps = Annotated[IPaymentUnitOfWork, Depends(get_payment_uow)]
