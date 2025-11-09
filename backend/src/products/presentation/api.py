from fastapi import APIRouter

from src.products.application.use_cases.collect_product import collect_products, collect_product
from src.products.application.use_cases.create_product import create_product
from src.products.presentation.dependencies import ProductUoWDep
from src.products.presentation.dtos import ProductCreateDTO

products_api_router = APIRouter()


@products_api_router.get("/")
async def get_products(uow: ProductUoWDep):
    return await collect_products(uow)


@products_api_router.get("/{product_id}")
async def get_product(product_id: int, uow: ProductUoWDep):
    return await collect_product(product_id, uow)


@products_api_router.post("/")
async def add_product(product_data: ProductCreateDTO, uow: ProductUoWDep):
    return await create_product(product_data, uow)


# @products_api_router.patch("/{product_id}")
# async def patch_product():
#     return
#
#
# @products_api_router.delete("/{product_id}")
# async def delete_product():
#     return
