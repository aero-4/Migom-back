import datetime
import pytest
import httpx
from httpx import Response

from src.categories.presentation.dtos import CategoryCreateDTO
from src.users.domain.dtos import UserCreateDTO

TEST_CATEGORY_DTO = CategoryCreateDTO(
    name="Пицца американская",
    photo="src/pizza.jpg"
)


@pytest.mark.asyncio(loop_scope="session")
async def test_success_collect_categories(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await client.post("/api/categories/", json=TEST_CATEGORY_DTO.model_dump(mode="python"))
        response2 = await client.get("/api/categories/")
        categories = response2.json()

        assert categories[0]['name'] == TEST_CATEGORY_DTO.name and categories[0]['photo'] == TEST_CATEGORY_DTO.photo


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_category(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        category_data = TEST_CATEGORY_DTO.model_dump()
        response = await client.post("/api/categories/", json=category_data)
        print(response)
        category = response.json()
        response_del = await client.delete(f"/api/categories/{category["id"]}")
        print(response_del)
        assert response_del.json() == None
