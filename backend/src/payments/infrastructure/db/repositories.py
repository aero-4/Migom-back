import logging
from abc import ABC

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.domain.exceptions import AlreadyExists
from src.payments.domain.entities import Payment, PaymentCreate, PaymentUpdate
from src.payments.domain.interfaces.payment_repo import IPaymentRepository
from src.payments.infrastructure.db.orm import PaymentsOrm


class PGPaymentRepository(IPaymentRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, payment: PaymentCreate) -> Payment:
        obj: PaymentsOrm = PaymentsOrm(**payment.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError as e:
            logging.error(e)
            raise AlreadyExists()

        return self._to_domain(obj)


    @staticmethod
    def _to_domain(obj: PaymentsOrm) -> Payment:
        return Payment(
            id=obj.id,
            amount=obj.amount,
            order_id=obj.order_id,
            payment_method=obj.payment_method,
            status=obj.status
        )
