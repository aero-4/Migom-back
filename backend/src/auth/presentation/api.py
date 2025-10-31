from fastapi import APIRouter, Depends, HTTPException, status

from src.auth.application.use_cases.authenication import authenticate, registration
from src.auth.presentation.dependencies import PasswordHasherDep, TokenAuthDep
from src.auth.presentation.dtos import AuthUserDTO, RegisterUserDTO
from src.users.presentation.dependencies import UserUoWDep

auth_api_router = APIRouter()


@auth_api_router.post("/login")
async def login(credentials: AuthUserDTO,
                pwd_hasher: PasswordHasherDep,
                uow: UserUoWDep,
                auth: TokenAuthDep):
    await authenticate(credentials.email, credentials.password, pwd_hasher, uow, auth)
    return {"message": "Login successful"}



@auth_api_router.post("/register")
async def register(credentials: RegisterUserDTO,
                   pwd_hasher: PasswordHasherDep,
                   uow: UserUoWDep,
                   auth: TokenAuthDep):
    await registration(credentials.email, credentials.password, credentials.first_name, credentials.last_name, credentials.birthday, pwd_hasher, uow, auth)
    return {"message": "Register successful"}