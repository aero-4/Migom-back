import abc

from src.orders.domain.entities import OrderCreate, Order


class IOrderRepository(abc.ABC):

    @abc.abstractmethod
    async def add(self, order: OrderCreate) -> Order:
        ...

    @abc.abstractmethod
    async def get(self, id: int) -> Order:
        ...

    @abc.abstractmethod
    async def get_all(self) -> list[Order]:
        ...

    @abc.abstractmethod
    async def delete(self, id: int) -> None:
        ...
