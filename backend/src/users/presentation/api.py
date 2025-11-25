from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import TokenAuthDep
from src.users.application.use_cases.information import information
from src.users.presentation.dependencies import UserUoWDep

users_api_router = APIRouter()


@users_api_router.get("/me")
async def get_user_info(uow: UserUoWDep,
                        auth: TokenAuthDep):
    return await information(uow, auth)
