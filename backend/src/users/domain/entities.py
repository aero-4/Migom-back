import datetime

from src.core.domain.entities import CustomModel


class User(CustomModel):
    id: int
    first_name: str
    last_name: str
    birthday: datetime.date
    email: str
    hashed_password: str
    is_super_user: bool


class UserInfo(CustomModel):
    first_name: str
    last_name: str
    birthday: datetime.date
    email: str


class UserCreate(CustomModel):
    first_name: str
    last_name: str
    email: str
    hashed_password: str
    birthday: datetime.date | None = None
    is_super_user: bool = False


class UserUpdate(CustomModel):
    id: int
    first_name: str | None = None
    last_name: str | None = None
    birthday: datetime.date | None = None
    email: str | None = None
