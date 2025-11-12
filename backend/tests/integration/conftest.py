import os

import httpx
import pytest_asyncio
from sqlalchemy import text

from src.db.engine import engine
from src.users.domain.dtos import UserCreateDTO

TABLES_TO_TRUNCATE = [
    "users", "categories", "products"
]


@pytest_asyncio.fixture(loop_scope="session")
async def clear_db():
    env = os.environ.get("ENVIRONMENT")
    if env != "testing":
        raise RuntimeError(f"clear_db can only be used in testing environment. Current ENVIRONMENT={env}")

    async with engine.begin() as conn:
        tables = ", ".join(TABLES_TO_TRUNCATE)
        query = f"TRUNCATE TABLE {tables} RESTART IDENTITY CASCADE;"
        print(await conn.execute(text(query)))

        return True


@pytest_asyncio.fixture
def user_factory():
    async def _create(client: httpx.AsyncClient, user: UserCreateDTO) -> UserCreateDTO:
        response = await client.post("/api/auth/register", json=user.model_dump(mode="json"))
        data = response.json()

        assert response.status_code == 200
        assert data["msg"] == "Register successful"

        return user

    return _create
