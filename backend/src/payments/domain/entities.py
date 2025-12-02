from src.core.domain.entities import CustomModel


class Payment(CustomModel):
    id: int
    amount: int
    label: str
    order_id: int
    method: str
    status: str


class PaymentCreate(CustomModel):
    order_id: int
    amount: int
    method: str
    label: str
    url: str | None = None


class PaymentUpdate(CustomModel):
    id: int
    amount: int | None = None
    status: str | None = None


