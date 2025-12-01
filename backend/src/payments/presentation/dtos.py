

class PaymentCreateDTO:
    order_id: int
    amount: int
    method: str


class PaymentUpdateDTO:
    order_id: int
    amount: int | None = None
    method: str | None = None