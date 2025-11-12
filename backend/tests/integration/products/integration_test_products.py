import httpx
import pytest

from src.categories.presentation.dtos import CategoryCreateDTO
from src.products.presentation.dtos import ProductCreateDTO

TEST_CATEGORY_DTO = CategoryCreateDTO(
    name="Бургеры",
    photo="src/photo1.jpg"
)
TEST_PRODUCT_DTO = ProductCreateDTO(
    name="Бургер - Бургерный",
    content="Бургеры в бургерной скале. Почувствуйте новые вкусы!",
    composition="зеленый лист, соль, сахар, огурцы",
    price=10,
    discount_price=10,
    discount=10,
    count=10,
    grams=10,
    protein=10,
    fats=10,
    carbohydrates=10,
    photo="src/photo1.jpg",
    category_id=1
)


@pytest.mark.asyncio(loop_scope="session")
async def test_success_collect_products(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await client.post("/api/categories/", json=TEST_CATEGORY_DTO.model_dump(mode="python"))

        response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="python"))
        response_create = response_create.json()
        assert response_create["name"] == TEST_PRODUCT_DTO.name
        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
        assert products[0]['name'] == TEST_PRODUCT_DTO.name



@pytest.mark.asyncio(loop_scope="session")
async def test_null_collect_products(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
        assert products == []
