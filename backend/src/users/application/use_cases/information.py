from src.auth.presentation.dependencies import TokenAuthDep
from src.users.domain.entities import User
from src.users.domain.interfaces.user_repo import IUserRepository
from src.users.domain.interfaces.user_uow import IUserUnitOfWork


async def information(uow: IUserUnitOfWork, auth: TokenAuthDep):
    async with uow:
        user_id = await auth.get_token_user_id()
        user = await uow.users.get_by_id(user_id)
        return user
