import datetime

import httpx
import pytest

from src.addresses.presentation.dtos import AddressCreateDTO
from src.users.domain.dtos import UserCreateDTO

TEST_USER = UserCreateDTO(email="test@test.com", password="test12345", first_name="Test", last_name="Test", birthday=datetime.date(1990, 1, 1))


@pytest.mark.asyncio
async def test_success_add_address(address_factory, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_USER)

        address_data = AddressCreateDTO(city="Москва", street="Колотушкина", house_number=12)
        await address_factory(client, address_data)
