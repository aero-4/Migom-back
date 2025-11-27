

class PaymentCreateDTO:
    order_id: int
    amount: int
    payment_method: str


class PaymentUpdateDTO:
    order_id: int
    amount: int | None = None
    payment_method: str | None = None