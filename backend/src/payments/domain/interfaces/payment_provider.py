import abc


class IPaymentProvider:

    @abc.abstractmethod
    def create_payment(self, data: dict) -> str: ...

    @abc.abstractmethod
    def read_payment(self, payment_id: str) -> dict: ...

    @abc.abstractmethod
    def update_payment(self, payment_id: str, data: dict) -> None: ...

    @abc.abstractmethod
    def delete_payment(self, payment_id: str) -> None: ...