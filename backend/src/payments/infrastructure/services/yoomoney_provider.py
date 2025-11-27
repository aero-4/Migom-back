import httpx

from src import settings
from src.payments.domain.entities import PaymentCreate
from src.payments.domain.interfaces.payment_provider import IPaymentProvider


class YoomoneyProvider(IPaymentProvider):
    def __init__(self):
        self.secret_key: str = settings.YOO_SECRET_KEY

        self.session = httpx.AsyncClient(base_url="https://yoomoney.ru/api",
                                         headers={"Authorization": f"Bearer {self.secret_key}"})

    async def create(self, payment: PaymentCreate) -> str:
        async with self.session as session:
            response = await session.post(
                "/request-payment",
                json=payment.model_dump(exclude={"order_id", "payment_method"}),
            )
        return response.json()["url"]

    async def process(self, payment_id: str) -> dict:
        return {}


    async def _authorize(self, payment_id: str) -> dict:
        return {}

    async def _get_token(self):
        return {}