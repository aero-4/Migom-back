from fastapi import APIRouter, Depends, HTTPException, status



auth_api_router = APIRouter()


@auth_api_router.post("/login")
async def login(credentials: AuthUserDTO):
    """
    Authenticate a user
    :param credentials:
    :return:
    """
    await authenticate()
    return {"message": "Login successful"}

