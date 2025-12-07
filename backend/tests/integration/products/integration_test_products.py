import datetime
import os
import random
import httpx
import pytest

from src.categories.domain.entities import Category
from src.categories.presentation.dtos import CategoryCreateDTO
from src.products.domain.entities import Product
from src.products.presentation.dtos import ProductCreateDTO, SearchDataDTO
from src.users.presentation.dtos import UserCreateDTO

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
    kilocalorie=11,
    photo="src/photo1.jpg",
    category_id=1
)
TEST_SUPER_USER = UserCreateDTO(email="test@test.com", password="test12345", first_name="Test", last_name="Test", birthday=datetime.date(1990, 1, 1), is_super_user=True)


async def create_product(client, product=None):
    TEST_PHOTOS = ["test (1).jpeg",
                   "test (2).jpeg",
                   "test (3).jpeg",
                   "test (4).jpeg",
                   "test (5).jpeg",
                   "test (6).jpeg",
                   "test (7).jpeg",
                   "test (8).jpeg"]
    resp = await client.post("/api/files/",
                             files={"file": open(random.choice(TEST_PHOTOS), "rb")}
                             )
    url = resp.json()["url"]

    category = CategoryCreateDTO(
        name=f"Бургеры №{random.randint(1, 1000)}",
        photo=url
    )

    response1 = await client.post("/api/categories/", json=category.model_dump(mode="json"))
    category = Category(**response1.json())
    product = product or ProductCreateDTO(
        name=f"Бургер - Бургерный №{random.randint(1, 2000)} ",
        content=f"Бургеры в бургерной скале. Почувствуйте новые вкусы! №{random.randint(1, 200)}",
        composition="зеленый лист, соль, сахар, огурцы",
        price=random.randint(1, 100),
        discount_price=random.randint(1, 100),
        discount=random.randint(1, 100),
        count=random.randint(1, 100),
        grams=random.randint(1, 100),
        protein=random.randint(1, 100),
        fats=random.randint(1, 100),
        carbohydrates=random.randint(1, 100),
        kilocalorie=random.randint(1, 100),
        category_id=category.id,
        photo=url,
    )

    response2 = await client.post("/api/products/", json=product.model_dump())
    product_created = Product(**response2.json())

    assert product_created.name == product.name
    return product_created


async def create_normal_product(client):
    TEST_PHOTOS = [os.path.join("normal", i) for i in os.listdir("normal")]
    PRICES = [999, 1999, 2199, 499, 899, 1399, 2599, 3499, 5999]
    NAME_CATS = ["Выбор пользователей", "Острее киберугроз", "Только здесь", "Новинки", "Только в доставке", "Комбо и ланчи", "Баскеты", "Бургеры"]
    NAMES = ["Комбо \"Курица в квадрате\" оригинальное", "Острое комбо от Kaspersky «Против звонков с неизвестного»", "Шефбургер оригинальный", "Комбо с Биг Маэстро", "Веджи Чиз Ролл классический", "8 Острых Крылышек", "Большое комбо \"Курица в квадрате\" оригинальное"]

    resp = await client.post("/api/files/",
                             files={"file": open(random.choice(TEST_PHOTOS), "rb")})
    url = resp.json()["url"]

    category_data = CategoryCreateDTO(
        name=random.choice(NAME_CATS),
        photo=url
    )

    response1 = await client.post("/api/categories/", json=category_data.model_dump(mode="json"))
    category = Category(**response1.json())

    for name in NAMES:
        product = ProductCreateDTO(
            name=name,
            content=f"Пирожок с манго-маракуйей и крем-чизом - это сочетание хрустящего теста с начинкой из спелого манго, свежей кислинкой маракуйи и лёгким сливочным кремом. *Продукция содержит или может содержать ракообразных или их следы, а также другие аллергены. Кроме ресторанов-исключений, указанных на сайте – https://rostics.ru/promo/noshrimps",
            composition="Филе куриное оригинальное; Томаты свежие; Салат Айсберг; Булочка бриошь; Сырная котлета; Соус на основе растительных масел со вкусом \"Блю Чиз\"",
            price=random.choice(PRICES),
            discount_price=random.randint(1, 200),
            discount=random.randint(1, 200),
            count=random.randint(1, 200),
            grams=random.randint(1, 200),
            protein=random.randint(1, 200),
            fats=random.randint(1, 200),
            carbohydrates=random.randint(1, 200),
            kilocalorie=random.randint(1, 200),
            category_id=category.id,
            photo=url,
        )

        response2 = await client.post("/api/products/", json=product.model_dump())
        product_created = Product(**response2.json())

        assert product_created.name == product.name


@pytest.mark.asyncio(loop_scope="session")
async def test_success_collect_products(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await user_factory(client, TEST_SUPER_USER)

        await client.post("/api/categories/", json=TEST_CATEGORY_DTO.model_dump(mode="json"))
        await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="json"))

        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
        assert products[0]['name'] == TEST_PRODUCT_DTO.name


@pytest.mark.asyncio(loop_scope="session")
async def test_null_collect_products(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await user_factory(client, TEST_SUPER_USER)

        response_create = await client.get("/api/products/")
        products = response_create.json()

        assert response_create.status_code == 200
        assert products == []


@pytest.mark.asyncio(loop_scope="session")
async def test_success_get_one_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await user_factory(client, TEST_SUPER_USER)
        product: Product = await create_product(client)
        response = await client.get(f"/api/products/{product.id}")
        product_data = Product(**response.json())

        assert response.status_code == 200
        assert product_data.name == product.name


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_get_one_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await user_factory(client, TEST_SUPER_USER)
        product_id = random.randint(1, 100)

        response = await client.get(f"/api/products/{product_id}")

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_create_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)
        product = await create_product(client, TEST_PRODUCT_DTO)

        assert product.name == TEST_PRODUCT_DTO.name


@pytest.mark.asyncio(loop_scope="session")
async def test_already_exists_create_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)
        await create_product(client, TEST_PRODUCT_DTO)

        response_create = await client.post("/api/products/", json=TEST_PRODUCT_DTO.model_dump(mode="json"))

        assert response_create.status_code == 409
        assert response_create.json() == {"detail": "Already exists"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_delete_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)
        product = await create_product(client)

        response = await client.delete(f"/api/products/{product.id}")

        assert response.json() is None


@pytest.mark.asyncio(loop_scope="session")
async def test_nof_found_delete_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)
        product_id = 1

        response = await client.delete(f"/api/products/{product_id}")

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_update_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)

        product: Product = await create_product(client)
        product.name = "Пицца"

        response = await client.patch(f"/api/products/{product.id}", json=product.model_dump())

        assert response.status_code == 200
        assert response.json()["name"] == product.name


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_update_product(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)
        product_id = 1
        response = await client.patch(f"/api/products/{product_id}", json=TEST_PRODUCT_DTO.model_dump())

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_get_all_by_name_filters(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)

        products = []
        for i in range(10):
            products.append(await create_product(client))

        search = SearchDataDTO(name="Бургер")
        search_response = await client.post("/api/products/search", json=search.model_dump())
        search_result = [Product(**i) for i in search_response.json()]

        assert products == search_result


@pytest.mark.asyncio(loop_scope="session")
async def test_add_some_test_products_and_categories(clear_db, user_factory, count: int = 25):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)

        for i in range(count):
            await create_product(client)

        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
        assert len(products) == count


@pytest.mark.asyncio(loop_scope="session")
async def test_add_some_normal_products_and_categories(clear_db, user_factory):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        await user_factory(client, TEST_SUPER_USER)

        await create_normal_product(client)

        response = await client.get("/api/products/")
        products = response.json()

        assert response.status_code == 200
