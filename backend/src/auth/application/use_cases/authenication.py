import datetime

from src.auth.domain.interfaces.token_auth import ITokenAuth
from src.users.domain.entities import UserCreate
from src.users.domain.exceptions import InvalidCredentials
from src.users.domain.interfaces.password_hasher import IPasswordHasher
from src.users.domain.interfaces.user_uow import IUserUnitOfWork


async def authenticate(email: str, password: str, pwd_hasher: IPasswordHasher, uow: IUserUnitOfWork, auth: ITokenAuth):
    async with uow:
        user = await uow.users.get_by_email(email)

        if not pwd_hasher.verify(password, user.hashed_password):
            raise InvalidCredentials()

        await auth.set_tokens(user)
        return user


async def registration(email: str, password: str, first_name: str, last_name: str, birthday: datetime.date, pwd_hasher: IPasswordHasher, uow: IUserUnitOfWork, auth: ITokenAuth):
    async with uow:
        user_create = UserCreate(email=email, hashed_password=pwd_hasher.hash(password), first_name=first_name, last_name=last_name, birthday=birthday)
        user = await uow.users.add(user_create)

        await auth.set_tokens(user)
        return user
