from src.addresses.domain.interfaces.address_uow import IAddressUnitOfWork


async def delete_address(address_id: int, uow: IAddressUnitOfWork) -> None:
    async with uow:
        await uow.addresses.delete(address_id)
        await uow.commit()

