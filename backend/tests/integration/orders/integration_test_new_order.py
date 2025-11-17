import datetime
import pytest
import httpx
from httpx import Response

from src.categories.domain.entities import Category
from src.categories.presentation.dtos import CategoryCreateDTO
from src.orders.domain.entities import Order, OrderStatus
from src.orders.presentation.dtos import OrderCreateDTO, CartItemDTO
from src.products.domain.entities import ProductCreate, Product
from src.users.domain.dtos import UserCreateDTO

TEST_USER_DTO = UserCreateDTO(
    email="olegtinkov@gmail.com",
    password="securepass",
    first_name="Oleg",
    last_name="Tinkov",
    birthday=datetime.date(2025, 1, 1)
)


async def _create_user(client: httpx.AsyncClient, user: UserCreateDTO):
    response = await client.post("/api/auth/register", json=user.model_dump(mode="json"))
    data = response.json()
    for token in ["access_token", "refresh_token"]:
        client.cookies.set(token, response.cookies.get(token))

    assert response.status_code == 200
    assert data["msg"] == "Register successful"


@pytest.mark.asyncio(loop_scope="session")
async def test_success_new_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        # create user
        await _create_user(client, TEST_USER_DTO)

        # create category
        category = CategoryCreateDTO(name="Пицца американская",
                                     photo="src/pizza.jpg")

        response = await client.post("/api/categories/", json=category.model_dump())
        category = Category(**response.json())

        # create products
        products = []
        for i in range(3):
            product_data = ProductCreate(name=f"product {i}",
                                         content="test content",
                                         composition="test composition",
                                         price=100,
                                         count=5,
                                         grams=1,
                                         protein=1,
                                         fats=1,
                                         carbohydrates=1,
                                         photo="test photo",
                                         category_id=category.id)
            response = await client.post("/api/products/", json=product_data.model_dump())

            assert response.status_code == 200

            product = Product(**response.json())

            assert product.name == product_data.name and product.photo == product_data.photo

            products.append(product)

        # create order's
        TEST_ORDER_DTO = OrderCreateDTO(
            creator_id=1,
            products=[CartItemDTO(product_id=p.id, quantity=p.count) for p in products],
            delivery_address="Ул Пушкина д. 10, кв. 1, г. Москва",
        )
        response = await client.post("/api/orders/", json=TEST_ORDER_DTO.model_dump())
        order: Order = Order(**response.json())

        assert response.status_code == 200
        assert order.products == [p.product_id for p in TEST_ORDER_DTO.products]
        assert order.status == OrderStatus.CREATED.value


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_products_new_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        # create user
        await _create_user(client, TEST_USER_DTO)

        # create category
        category = CategoryCreateDTO(name="Пицца американская",
                                     photo="src/pizza.jpg")

        response = await client.post("/api/categories/", json=category.model_dump())
        category = Category(**response.json())

        # create products
        products = []
        random_id = 12345
        for i in range(3):
            product_data = ProductCreate(name=f"product {i}",
                                         content="test content",
                                         composition="test composition",
                                         price=100,
                                         count=5,
                                         grams=1,
                                         protein=1,
                                         fats=1,
                                         carbohydrates=1,
                                         photo="test photo",
                                         category_id=category.id)
            response = await client.post("/api/products/", json=product_data.model_dump())

            assert response.status_code == 200

            product = Product(**response.json())

            assert product.name == product_data.name and product.photo == product_data.photo

            products.append(product)

        # create order's
        TEST_ORDER_DTO = OrderCreateDTO(
            creator_id=1,
            products=[CartItemDTO(product_id=random_id, quantity=p.count) for p in products],
            delivery_address="Ул Пушкина д. 10, кв. 1, г. Москва",
        )
        response = await client.post("/api/orders/", json=TEST_ORDER_DTO.model_dump())

        assert response.status_code == 404
        assert response.json() == {"detail": f"Product with id {random_id} not found"}
