import random
from unittest.mock import MagicMock, AsyncMock

import pytest
import datetime

from src.categories.application.use_cases.collect_categories import collect_categories
from src.categories.application.use_cases.new_categories import add_category
from src.categories.domain.entities import CategoryCreate
from src.categories.domain.interfaces.category_uow import ICategoryUnitOfWork
from src.categories.presentation.dtos import CategoryCreateDTO
from src.products.application.use_cases.collect_product import collect_products
from src.products.application.use_cases.create_product import create_product
from src.products.domain.entities import ProductCreate
from src.products.presentation.dtos import ProductCreateDTO


@pytest.mark.asyncio
async def test_collection_products(monkeypatch, fake_product_uow):
    product = ProductCreate(name="Бургер - Бургерный",
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
                            category_id=1)
    count: int = random.randint(1, 100)
    for i in range(count):
        await fake_product_uow.products.add(product)

    products = await collect_products(uow=fake_product_uow)

    assert len(products) == count
    assert products[0].name == product.name

# @pytest.mark.asyncio
# async def test_collect_product(monkeypatch, fake_cat_uow):
#     category = CategoryCreateDTO(name="Бургеры",
#                                  photo="src/photo1.jpg")
#     await add_category(category, uow=fake_cat_uow)
#
#     categories = await collect_categories(uow=fake_cat_uow)
#
#     assert len(categories) == 1
#     assert categories[0].name == category.name
