import datetime
import pytest
import httpx
from httpx import Response

from src.users.presentation.dtos import UserCreateDTO

TEST_USER_DTO = UserCreateDTO(
    email="olegtinkov@gmail.com",
    password="securepass",
    first_name="Oleg",
    last_name="Tinkov",
    birthday=datetime.date(2025, 1, 1)
)


@pytest.mark.asyncio(loop_scope="session")
async def test_get_me_success(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await user_factory(client, TEST_USER_DTO)

        response2 = await client.get("/api/users/me")

        assert response2.json() == TEST_USER_DTO.model_dump(exclude={"password", "is_super_user"}, mode="json")


@pytest.mark.asyncio(loop_scope="session")
async def test_user_permission_denied(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response2 = await client.get("/api/users/me")

        assert response2.status_code == 403
        assert response2.json() == {"detail": "Permission denied"}


@pytest.mark.asyncio(loop_scope="session")
async def test_allowed_paths_user(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        # allowed
        user = await user_factory(client, TEST_USER_DTO)

        response2 = await client.get("/api/users/me")

        assert response2.status_code == 200
        assert response2.json() == TEST_USER_DTO.model_dump(exclude={"password", "is_super_user"}, mode="json")


@pytest.mark.asyncio(loop_scope="session")
async def test_forbidden_paths_user(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        user = await user_factory(client, TEST_USER_DTO)

        response3 = await client.get("/api/orders")
        assert response3.status_code == 403

        response4 = await client.get("/api/addresses")
        assert response4.status_code == 403

        response5 = await client.get("/api/products")
        assert response5.status_code == 403

        response6 = await client.get("/api/orders")
        assert response6.status_code == 403


@pytest.mark.asyncio(loop_scope="session")
async def test_success_change_password(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        user = await user_factory(client, TEST_USER_DTO)
        response = await client.post("/api/users/password", json={"password": "newpass1234"})

        assert response.status_code == 200
        assert response.json() == {"msg": "Password changed"}


@pytest.mark.asyncio(loop_scope="session")
async def test_fail_change_password(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        user = await user_factory(client, TEST_USER_DTO)
        response = await client.post("/api/users/password", json={"password": "newpas"})

        assert response.status_code == 422
        assert response.json()["detail"][0]["msg"] == "String should have at least 8 characters"
