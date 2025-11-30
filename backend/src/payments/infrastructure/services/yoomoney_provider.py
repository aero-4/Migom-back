import asyncio
import logging

import httpx

from aiomoney.aiomoney import authorize_app, YooMoney
from aiomoney.aiomoney.schemas import InvoiceSource
from src import settings
from src.payments.config import payment_settings
from src.payments.domain.entities import PaymentCreate
from src.payments.domain.interfaces.payment_provider import IPaymentProvider


class YoomoneyProvider(IPaymentProvider):
    def __init__(self):
        self.client_id: str = payment_settings.YOOMONEY_CLIENT_ID
        self.secret_key: str = payment_settings.YOOMONEY_SECRET_KEY
        self.redirect_uri: str = payment_settings.YOOMONEY_REDIRECT_URI

        self.wallet = YooMoney(access_token=payment_settings.YOOMONEY_ACCESS_TOKEN)

    async def create(self, payment: PaymentCreate) -> str:
        # async with httpx.AsyncClient(base_url="https://yoomoney.ru/api/") as session:
        #     response = await session.post(
        #         "/request-payment",
        #         json=payment.model_dump(exclude={"order_id", "payment_method"}),
        #     )

        payment_form = await self.wallet.create_invoice(
            amount_rub=payment.amount,
            label=payment.label,
            payment_source=InvoiceSource.YOOMONEY_WALLET,
        )
        return payment_form.url

    async def process(self, payment_id: str) -> dict:
        return {}

    async def _authorize(self) -> str | None:
        """
        Get code authorization from Yoomoney
        Returns: str
        """
        async with httpx.AsyncClient() as session:
            response = await session.post(
                f"https://yoomoney.ru/api/oauth/authorize",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                params={
                    "client_id": self.client_id,
                    "response_type": "code",
                    "redirect_uri": self.redirect_uri,
                    "scope": "money-source payment payment-shop payment-p2p"
                },
                follow_redirects=True
            )
            response.raise_for_status()

        logging.info(response.url)
        code = response.url.params.get("code")

        return code

    async def _get_access_token(self):
        """
        Get access token from Yoomoney
        Returns: str
        """
        async with httpx.AsyncClient(base_url="https://yoomoney.ru/api/") as session:
            response = await session.post(
                f"/oauth/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "client_id": self.client_id,
                    "code": "authorization code",
                    "redirect_uri": self.redirect_uri,
                    "grant_type": "authorization_code",
                },
                follow_redirects=True
            )
            response.raise_for_status()

        data = response.json()

        if data.get("error"):
            logging.error("Not get access token: %s", data.get("error"))
            return None

        return data.get("access_token", None)
