from typing import Any

from backend.src.crud.base import CRUDBase
from backend.src.users.infrasctructure.db.orm import UserOrm
from backend.src.users.infrasctructure.services.password_hasher import BcryptPasswordHasher


class UserService(CRUDBase, model=UserOrm):

    async def create(self, data: dict[str, Any]) -> UserOrm:
        password = data.pop("password")
        orm_object = self.model(**data)

        async with self.session_maker as session:
            orm_object.hashed_password = BcryptPasswordHasher().hash(password)
            session.add(orm_object)
            await session.commit()

        return orm_object
