from src.core.domain.entities import CustomModel


class Payment(CustomModel):
    id: int
    amount: int
    order_id: int
    payment_method: str
    status: str


class PaymentCreate(CustomModel):
    order_id: int
    amount: int
    payment_method: str



class PaymentUpdate(CustomModel):
    id: int
    order_id: int | None = None
    amount: int | None = None
    payment_method: str | None = None