from typing import List

from src.addresses.domain.entities import Address
from src.addresses.domain.interfaces.address_uow import IAddressUnitOfWork


async def collect_addresses(uow: IAddressUnitOfWork) -> List[Address]:
    async with uow:
        addresses = await uow.addresses.get_all()
    return addresses
