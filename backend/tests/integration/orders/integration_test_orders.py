import datetime
import random

import pytest
import httpx
from httpx import Response

from src.categories.domain.entities import Category
from src.categories.presentation.dtos import CategoryCreateDTO
from src.orders.domain.entities import Order, OrderStatus
from src.orders.presentation.dtos import OrderCreateDTO, CartItemDTO, OrderUpdateDTO
from src.products.domain.entities import ProductCreate, Product
from src.users.domain.dtos import UserCreateDTO
from src.utils.strings import generate_random_alphanum

TEST_USER_DTO = UserCreateDTO(
    email=f"olegtinkov{random.randint(100, 999)}@gmail.com",
    password="securepass",
    first_name="Oleg",
    last_name="Tinkov",
    birthday=datetime.date(2025, 1, 1)
)


async def create_order(client, user_factory) -> Order:
    user_data = UserCreateDTO(
        email=f"olegtinkov{random.randint(100, 999)}@gmail.com",
        password=f"securepass{random.randint(100, 999)}",
        first_name=f"Oleg{random.randint(100, 999)}",
        last_name=f"Tinkov{random.randint(100, 999)}",
        birthday=datetime.date(2025, 1, 1)
    )
    await user_factory(client, user_data)

    # create category
    category = CategoryCreateDTO(name=generate_random_alphanum(),
                                 photo="src/pizza.jpg")

    response = await client.post("/api/categories/", json=category.model_dump())
    category = Category(**response.json())

    # create products
    products = []
    for i in range(3):
        product_data = ProductCreate(name=f"product {random.randint(100, 999)}",
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

    return order


@pytest.mark.asyncio(loop_scope="session")
async def test_success_new_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        await create_order(client, user_factory)


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_products_new_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        # create user
        await user_factory(client, TEST_USER_DTO)

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


@pytest.mark.asyncio(loop_scope="session")
async def test_success_delete_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        order = await create_order(client, user_factory)
        response = await client.delete(f"/api/orders/{order.id}")

        assert response.status_code == 200
        assert response.json() is None


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_delete_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        random_id = 123
        response = await client.delete(f"/api/orders/{random_id}")

        assert response.status_code == 404
        assert response.json() == {'detail': 'Not found'}


@pytest.mark.asyncio(loop_scope="session")
async def test_success_get_one_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        order: Order = await create_order(client, user_factory)
        response = await client.get(f"/api/orders/{order.id}")
        order_get = Order(**response.json())

        assert response.status_code == 200
        assert order_get.delivery_address == order.delivery_address and order_get.id == order.id


@pytest.mark.asyncio(loop_scope="session")
async def test_not_found_get_one_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        random_id = 1234
        response = await client.get(f"/api/orders/{random_id}")

        assert response.status_code == 404
        assert response.json() == {"detail": "Not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_collect_orders(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        orders = []
        for i in range(3):
            order = await create_order(client, user_factory)
            orders.append(order)

        response = await client.get(f"/api/orders/")
        collect_orders = [Order(**o) for o in response.json()]

        assert response.status_code == 200
        assert collect_orders == orders


@pytest.mark.asyncio(loop_scope="session")
async def test_null_collect_orders(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        response = await client.get(f"/api/orders/")
        collect_orders = [Order(**o) for o in response.json()]

        assert response.status_code == 200
        assert collect_orders == []


@pytest.mark.asyncio(loop_scope="session")
async def test_success_update_order(clear_db, user_factory):
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        orders = []
        for i in range(3):
            order = await create_order(client, user_factory)
            orders.append(order)

        order: Order = random.choice(orders)

        order_data = OrderUpdateDTO(creator_id=1, products=[CartItemDTO(product_id=10, quantity=4)])

        response = await client.patch(f"/api/orders/{order.id}", json=order_data.model_dump())
        order_updated = Order(**response.json())

        assert response.status_code == 200
        assert order_updated.id == order.id
        assert order_updated.products == order.products
        assert order_updated.delivery_address == order.delivery_address
