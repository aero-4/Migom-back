from fastapi import APIRouter

from src.addresses.application.use_cases.add_address import add_address
from src.addresses.application.use_cases.collect_addresses import collect_addresses
from src.addresses.application.use_cases.delete_address import delete_address
from src.addresses.application.use_cases.update_address import update_address
from src.addresses.presentation.dependencies import AddressUoWDeps
from src.addresses.presentation.dtos import AddressUpdateDTO, AddressCreateDTO
from src.auth.presentation.dependencies import TokenAuthDep

addresses_api_router = APIRouter()


@addresses_api_router.post("/")
async def add(address_data: AddressCreateDTO, uow: AddressUoWDeps, auth: TokenAuthDep):
    return await add_address(address_data, uow, auth)


@addresses_api_router.get("/")
async def get_all(uow: AddressUoWDeps, auth: TokenAuthDep):
    return await collect_addresses(uow, auth)


@addresses_api_router.patch("/{id}")
async def update(id: int, address_update: AddressUpdateDTO, uow: AddressUoWDeps, auth: TokenAuthDep):
    return await update_address(id, address_update, uow, auth)


@addresses_api_router.delete("/{id}")
async def delete(id: int, uow: AddressUoWDeps, auth: TokenAuthDep):
    return await delete_address(id, uow, auth)
