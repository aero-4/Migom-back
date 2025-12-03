from src.auth.presentation.dependencies import TokenAuthDep, PasswordHasherDep
from src.users.domain.entities import User
from src.users.presentation.dependencies import UserUoWDep
from src.users.presentation.dtos import UserPasswordUpdateDTO


async def update_password(password_data: UserPasswordUpdateDTO,
                          user: User,
                          auth: TokenAuthDep,
                          pwd_hasher: PasswordHasherDep,
                          uow: UserUoWDep) -> None:
    async with uow:
        user = await uow.get_by_id(user.id)
        user.hashed_password = await pwd_hasher.hash(password_data.password)
        await auth.set_tokens(user)
        await uow.commit()
