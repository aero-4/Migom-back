from src.auth.presentation.dependencies import TokenAuthDep


async def get_payment_callback(
        uow: PaymentUoWDeps,
        auth: TokenAuthDep
):
    async with uow:
        payment = await uow.payments.get()