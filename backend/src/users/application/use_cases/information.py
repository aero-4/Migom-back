from src.auth.domain.entities import TokenType
from src.auth.presentation.dependencies import TokenAuthDep
from src.users.domain.entities import UserInfo
from src.users.domain.interfaces.user_repo import IUserRepository
from src.users.domain.interfaces.user_uow import IUserUnitOfWork


async def information(uow: IUserUnitOfWork, auth: TokenAuthDep):
    async with uow:
        user_id = await auth.get_token_id(TokenType.ACCESS)
        user = await uow.users.get_by_id(user_id)
        user_info = UserInfo(first_name=user.first_name, last_name=user.last_name, birthday=user.birthday, email=user.email)
        return user_info
