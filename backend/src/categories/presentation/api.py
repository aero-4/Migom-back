from fastapi import APIRouter

from src.auth.presentation.permissions import access_control
from src.categories.application.use_cases.collect_categories import collect_categories
from src.categories.application.use_cases.delete_category import delete_category
from src.categories.application.use_cases.new_categories import add_category
from src.categories.application.use_cases.update_category import update_category
from src.categories.presentation.dependencies import CategoryUoWDep
from src.categories.presentation.dtos import CategoryCreateDTO, CategoryUpdateDTO

categories_api_router = APIRouter()


@categories_api_router.get("/")
async def get_all(uow: CategoryUoWDep):
    return await collect_categories(uow)


@categories_api_router.post("/")
async def new(category: CategoryCreateDTO, uow: CategoryUoWDep):
    return await add_category(category, uow)


@access_control(superuser=True)
@categories_api_router.delete("/{id}")
async def delete(id: int, uow: CategoryUoWDep):
    return await delete_category(id, uow)


@access_control(superuser=True)
@categories_api_router.patch("/{id}")
async def patch(id: int, category: CategoryUpdateDTO, uow: CategoryUoWDep):
    return await update_category(id, category, uow)
