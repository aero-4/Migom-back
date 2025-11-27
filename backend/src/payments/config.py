from functools import cached_property
from typing import Literal
from pydantic import SecretStr
from pydantic_settings import BaseSettings


class PaymentSettings(BaseSettings):
    """
    Settings for the payment module.
    """
    YOO_MONEY_CLIENT_ID: str = "Migom"
    YOO_MONEY_SECRET_KEY: str = "377319D676A2F8CFE0DEB3042433FCE288A08DD5DF24F35DAE02617A80AD4CE0"


payment_settings = PaymentSettings()
