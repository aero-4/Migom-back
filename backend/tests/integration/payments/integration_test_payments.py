import pytest
from aiomoney import authorize_app, YooMoney
from aiomoney.schemas import InvoiceSource

from src.payments.application.use_cases.add_payment import add_payment
from src.payments.domain.entities import PaymentCreate
from src.payments.presentation.dependenscies import PaymentUoWDeps
from src.payments.config import payment_settings


