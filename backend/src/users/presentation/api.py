from fastapi import APIRouter

from src.auth.presentation.dependencies import TokenAuthDep
from src.users.application.use_cases.information import information
from src.users.presentation.dependencies import UserUoWDep

users_api_router = APIRouter()


@users_api_router.get("/info")
async def get_user_info(uow: UserUoWDep,
                        auth: TokenAuthDep):
    return await information(uow, auth)


@users_api_router.post("/delivering_info/")
async def add_delivering_info(uow: UserUoWDep, auth: TokenAuthDep):
    return


@users_api_router.get("/delivering_info/")
async def get_all_delivering_info(uow: UserUoWDep, auth: TokenAuthDep):
    return


@users_api_router.patch("/delivering_info/")
async def update_delivering_info(uow: UserUoWDep, auth: TokenAuthDep):
    return
