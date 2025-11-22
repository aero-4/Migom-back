import asyncio
import datetime
import random

from src.auth.presentation.dependencies import get_password_hasher
from src.users.domain.entities import UserCreate
from src.users.presentation.dependencies import get_user_uow
from src.utils.strings import generate_random_alphanum


async def create_super_user(email: str, uow=get_user_uow(), pwd_hasher=get_password_hasher()):
    random_password = generate_random_alphanum()
    async with uow:
        user_create = UserCreate(email=email,
                                 hashed_password=pwd_hasher.hash(random_password),
                                 first_name=f"Admin{random.randint(100000, 999999)}",
                                 last_name=f"Adminov{random.randint(100000, 999999)}",
                                 is_super_user=True,
                                 birthday=datetime.date(year=1950, month=1, day=1))
        user = await uow.users.add(user_create)
        await uow.commit()

    print(f"Admin created! \n\n Email: {user.email} \n Password: {random_password}")


if __name__ == "__main__":
    email = input("Input your email: ")
    asyncio.run(create_super_user(email))
