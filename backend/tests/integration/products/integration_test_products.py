import random
import httpx
import pytest

from src.categories.presentation.dtos import CategoryCreateDTO
from src.products.domain.entities import Product
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


async def create_product(client):
    await client.post("/api/categories/", json=TEST_CATEGORY_DTO.model_dump(mode="json"))

    response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="json"))
    response_create = response_create.json()

    assert response_create["name"] == TEST_PRODUCT_DTO.name
    return Product(**response_create)


@pytest.mark.asyncio(loop_scope="session")
async def test_success_collect_products(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await create_product(client)

        response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="json"))
        response_create = response_create.json()
        assert response_create["name"] == TEST_PRODUCT_DTO.name
        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
        assert products[0]['name'] == TEST_PRODUCT_DTO.name


@pytest.mark.asyncio(loop_scope="session")
async def test_null_collect_products(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump())
        products = response_create.json()

        assert response_create.status_code == 200
        assert products == []


@pytest.mark.asyncio(loop_scope="session")
async def test_success_get_one_product(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        product: Product = await create_product(client)
        response = await client.get(f"/api/products/{product.id}")
        product_data = Product(**response.json())

        assert response.status_code == 200
        assert product_data.name == product.name


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_get_one_product(clear_db):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        product_id = random.randint(1, 100)

        response = await client.get(f"/api/products/{product_id}")

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_create_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        product = await create_product(client)

        assert product.name == TEST_PRODUCT_DTO.name


@pytest.mark.asyncio(loop_scope="session")
async def test_already_exists_create_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await create_product(client)

        response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="json"))

        assert response_create.status_code == 409
        assert response_create.json() == {"detail": "Already exists"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_delete_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        product = await create_product(client)

        response = await client.delete(f"/api/products/{product.id}")

        assert response.json() is None


@pytest.mark.asyncio(loop_scope="session")
async def test_nof_found_delete_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        product_id = 1

        response = await client.delete(f"/api/products/{product_id}")

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_update_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        product: Product = await create_product(client)
        product.name = "Пицца"
        response = await client.patch(f"/api/products/{product.id}", json=product.model_dump())

        assert response.status_code == 200
        assert response.json()["name"] == product.name


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_update_product(clear_db):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # product: Product = await create_product(client)
        product_id = 1
        response = await client.patch(f"/api/products/{product_id}", json=TEST_PRODUCT_DTO.model_dump())

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}
