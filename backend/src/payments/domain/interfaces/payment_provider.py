import abc

from src.payments.domain.entities import PaymentCreate


class IPaymentProvider:

    @abc.abstractmethod
    async def create(self, payment_data: PaymentCreate) -> str: ...

    @abc.abstractmethod
    async def process(self, payment_id: str) -> dict: ...
