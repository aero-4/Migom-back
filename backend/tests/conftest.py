import warnings
from typing import AsyncIterator

import httpx
import pytest
import pytest_asyncio
from _pytest.warning_types import PytestDeprecationWarning

from main import app
from tests.fakes.categories import FakeCategoryUnitOfWork
from tests.fakes.products import FakeProductUnitOfWork
from tests.fakes.users import FakeUserUnitOfWork


@pytest_asyncio.fixture(loop_scope="session")
async def client() -> AsyncIterator[httpx.AsyncClient]:
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://testserver') as client:
        yield client


@pytest.fixture
def fake_user_uow():
    return FakeUserUnitOfWork()


@pytest.fixture
def fake_cat_uow():
    return FakeCategoryUnitOfWork()


@pytest.fixture
def fake_product_uow():
    return FakeProductUnitOfWork()
