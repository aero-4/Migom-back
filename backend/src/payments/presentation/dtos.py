from pydantic import BaseModel


class PaymentCreateDTO(BaseModel):
    order_id: int
    amount: int
    method: str | None = None


