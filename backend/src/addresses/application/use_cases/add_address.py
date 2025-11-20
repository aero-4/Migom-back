from src.addresses.domain.entities import Address, AddressCreate
from src.addresses.domain.interfaces.address_uow import IAddressUnitOfWork
from src.addresses.presentation.dtos import AddressCreateDTO
from src.auth.domain.entities import TokenType
from src.auth.presentation.dependencies import TokenAuthDep


async def add_address(address_data: AddressCreateDTO, uow: IAddressUnitOfWork, auth: TokenAuthDep) -> Address:
    token_data = await auth.read_token(TokenType.ACCESS)

    address_data = AddressCreate(user_id=token_data.user_id, **address_data.model_dump())

    async with uow:
        address = await uow.addresses.add(address_data)
    return address
