from src.auth.presentation.dependencies import TokenAuthDep
from src.payments.domain.entities import Payment
from src.payments.presentation.dependenscies import PaymentUoWDeps


async def get_payment_callback(
        uow: PaymentUoWDeps,
        auth: TokenAuthDep
) -> Payment:
    async with uow:
        payment = await uow.payments.get()

    return payment
