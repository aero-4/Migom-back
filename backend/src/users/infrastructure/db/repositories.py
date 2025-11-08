from abc import ABC

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.users.domain.entities import User, UserCreate, UserUpdate
from src.users.domain.exceptions import UserAlreadyExists, UserNotFound
from src.users.domain.interfaces.user_repo import IUserRepository
from src.users.infrastructure.db.orm import UserOrm


class PGUserRepository(IUserRepository, ABC):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__()
        self.session = session

    async def add(self, user: UserCreate) -> User:
        obj = UserOrm(**user.model_dump(mode='python'))
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError:
            raise UserAlreadyExists()

        return self._to_domain(obj)

    async def get_by_email(self, email: str) -> User:
        stmt = select(UserOrm).where(UserOrm.email == email)
        result = await self.session.execute(stmt)
        obj: UserOrm = result.scalar_one_or_none()

        if not obj:
            raise UserNotFound(detail=f"User with email {email} not found")

        return self._to_domain(obj)

    async def get_by_id(self, id: int) -> User:
        stmt = select(UserOrm).where(UserOrm.id == id)
        result = await self.session.execute(stmt)
        obj: UserOrm = result.scalar_one_or_none()

        if not obj:
            raise UserNotFound(detail=f"User not found")

        return self._to_domain(obj)

    async def update(self, user: UserUpdate) -> User:
        obj = UserOrm(**user.model_dump(mode='python'))
        self.session.add(obj)
        await self.session.flush()
        return self._to_domain(obj)

    async def delete(self, user: User):
        stmt = select(UserOrm).where(UserOrm.id == user.id)
        result = await self.session.execute(stmt)
        obj: UserOrm = result.scalar_one_or_none()

        if not obj:
            raise UserNotFound(detail=f"User with id {user.id} not found")

        await self.session.delete(obj)
        await self.session.flush()

    @staticmethod
    def _to_domain(obj: UserOrm) -> User:
        return User(
            id=obj.id,
            birthday=obj.birthday,
            email=obj.email,
            hashed_password=obj.hashed_password,
            first_name=obj.first_name,
            last_name=obj.last_name
        )
