import datetime
import pytest
import httpx
from httpx import Response

from src.users.domain.dtos import UserCreateDTO

TEST_USER_DTO = UserCreateDTO(
    email="olegtinkov@gmail.com",
    password="securepass",
    first_name="Oleg",
    last_name="Tinkov",
    birthday=datetime.date(2025, 1, 1)
)


async def _create(client: httpx.AsyncClient, user: UserCreateDTO) -> Response:
    response = await client.post("/api/auth/register", json=user.model_dump(mode="json"))
    data = response.json()

    assert response.status_code == 200
    assert data["msg"] == "Register successful"

    return response


@pytest.mark.asyncio(loop_scope="session")
async def test_get_info_success(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response = await _create(client, TEST_USER_DTO)

        for token in ["access_token", "refresh_token"]:
            client.cookies.set(token, response.cookies.get(token))

        response2 = await client.get("/api/users/info")

        user_data = TEST_USER_DTO.model_dump(mode="json")
        user_data.pop("password")
        assert response2.json() == user_data


@pytest.mark.asyncio(loop_scope="session")
async def test_user_not_found(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response2 = await client.get("/api/users/info")  # without cookies
        assert response2.json() == {"detail": "User not found"}
