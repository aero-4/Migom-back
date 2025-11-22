from src.addresses.domain.entities import Address, AddressUpdate
from src.addresses.domain.interfaces.address_uow import IAddressUnitOfWork
from src.addresses.presentation.dtos import AddressUpdateDTO


async def update_address(id: int, address_update: AddressUpdateDTO, uow: IAddressUnitOfWork) -> Address:
    address_data = AddressUpdate(id=id, **address_update.model_dump())
    async with uow:
        address = await uow.addresses.update(address_data)
        await uow.commit()

    return address
