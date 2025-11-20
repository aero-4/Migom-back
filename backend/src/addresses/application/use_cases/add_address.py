from src.addresses.domain.entities import Address, AddressCreate
from src.addresses.domain.interfaces.address_uow import IAddressUnitOfWork
from src.addresses.presentation.dtos import AddressCreateDTO


async def add_address(address_data: AddressCreateDTO, uow: IAddressUnitOfWork) -> Address:
    address_data = AddressCreate(**address_data.model_dump())

    async with uow:
        address = await uow.addresses.add(address_data)
    return address
