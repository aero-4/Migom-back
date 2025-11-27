import abc


class IPaymentProvider:

    @abc.abstractmethod
    async def create(self, data: dict) -> str: ...

    @abc.abstractmethod
    async def process(self, payment_id: str) -> dict: ...
