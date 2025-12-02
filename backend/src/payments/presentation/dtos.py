from pydantic import BaseModel


class PaymentCreateDTO(BaseModel):
    order_id: int
    amount: int
    method: str | None = None


class PaymentUpdateDTO(BaseModel):
    order_id: int
    amount: int | None = None
    method: str | None = None