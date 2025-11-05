import datetime

import pytest
import httpx

from src.users.domain.dtos import UserCreateDTO

new_user = UserCreateDTO(
    email="olegtinkov@gmail.com",
    password="securepass",
    first_name="Oleg",
    last_name="Tinkov",
    birthday=datetime.date(2025, 1, 1)
)


@pytest.mark.asyncio(loop_scope="session")
async def test_login(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client=client, user=new_user)
        login_data = {"email": new_user.email, "password": new_user.password}
        await _login_and_set_cookies(client, login_data)


async def _login_and_set_cookies(client: httpx.AsyncClient, login_data: dict):
    response = await client.post("/api/auth/login", json=login_data)

    for token in ["access_token", "refresh_token"]:
        client.cookies.set(token, response.cookies.get(token))

    assert response.status_code == 200
    assert response.json() == {"detail": "Tokens set"}
