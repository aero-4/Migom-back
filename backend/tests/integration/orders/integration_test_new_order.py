import datetime
import pytest
import httpx
from httpx import Response

from src.orders.domain.entities import Order, OrderStatus, OrderCreate
from src.orders.presentation.dtos import OrderCreateDTO
from src.products.domain.entities import ProductCreate, Product
from src.products.presentation.dtos import ProductCreateDTO
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
    async with httpx.AsyncClient(base_url='http://127.0.0.2:8000') as client:
        # create user
        await _create_user(client, TEST_USER_DTO)

        # create products
        products = []
        for i in range(3):
            product = ProductCreate(name=f"product {i}",
                                    content="test content",
                                    composition="test composition",
                                    price=100,
                                    count=1,
                                    grams=1,
                                    protein=1,
                                    fats=1,
                                    carbohydrates=1,
                                    photo="test photo",
                                    category_id=1)
            response = await client.post("/api/products/", json=product.model_dump())
            print(response.text)
            assert response.status_code == 200

            product = Product(**response.json())
            products.append(product)

        # create order
        TEST_ORDER_DTO = OrderCreateDTO(
            creator_id=1,
            products=[p.id for p in products],
            delivery_address="Ул Пушкина д. 10, кв. 1, г. Москва",
            amount=1411
        )
        response = await client.post("/api/orders/", json=TEST_ORDER_DTO.model_dump())
        order: Order = Order(**response.json())

        assert response.status_code == 200
        assert order.amount == TEST_ORDER_DTO.amount and order.products == TEST_ORDER_DTO.products
        assert order.status == OrderStatus.CREATED
