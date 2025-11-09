from fastapi import APIRouter

from src.categories.application.use_cases.collect_categories import collect_categories
from src.categories.application.use_cases.new_categories import add_category
from src.categories.presentation.dependencies import CategoryUoWDep
from src.categories.presentation.dtos import CategoryCreateDTO

categories_api_router = APIRouter()


@categories_api_router.get("/")
async def get_all_categories(uow: CategoryUoWDep):
    return await collect_categories(uow)


@categories_api_router.post("/")
async def new_category(category: CategoryCreateDTO, uow: CategoryUoWDep):
    return await add_category(category, uow)