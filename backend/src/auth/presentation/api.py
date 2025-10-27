from fastapi import APIRouter, Depends, HTTPException, status

from backend.src.auth.application.use_cases.authenication import authenticate
from backend.src.auth.dependcies import get_password_hasher
from backend.src.auth.presentation.dtos import AuthUserDTO
from backend.src.users.domain.interfaces.password_hasher import IPasswordHasher
from backend.src.users.domain.interfaces.user_uow import IUserUnitOfWork

auth_api_router = APIRouter()


@auth_api_router.post("/login")
async def login(credentials: AuthUserDTO, pwd_hasher: Depends(get_password_hasher), uow: IUserUnitOfWork):
    await authenticate(credentials.email, credentials.password, pwd_hasher, uow)
    return {"message": "Login successful"}

