import abc

from src.payments.domain.entities import Payment, PaymentCreate, PaymentUpdate


class IPaymentRepository(abc.ABC):
    @abc.abstractmethod
    async def add(self, payment: PaymentCreate) -> Payment:
        ...

    @abc.abstractmethod
    async def get(self, order_id: int) -> Payment:
        ...

    @abc.abstractmethod
    async def delete(self, order_id: int) -> None:
        ...

    @abc.abstractmethod
    async def update(self, payment: PaymentUpdate) -> None:
        ...
