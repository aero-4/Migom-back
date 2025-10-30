from fastapi import APIRouter, Depends, HTTPException, status

from src.auth.application.use_cases.authenication import authenticate
from src.auth.presentation.dependencies import PasswordHasherDep, TokenAuthDep
from src.auth.presentation.dtos import AuthUserDTO
from src.users.presentation.dependencies import UserUoWDep

auth_api_router = APIRouter()


@auth_api_router.post("/login")
async def login(credentials: AuthUserDTO,
                pwd_hasher: PasswordHasherDep,
                uow: UserUoWDep,
                auth: TokenAuthDep):
    await authenticate(credentials.email, credentials.password, pwd_hasher, uow, auth)
    return {"message": "Login successful"}

