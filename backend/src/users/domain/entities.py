import datetime

from backend.src.core.domain.entities import CustomModel


class User(CustomModel):
    id: str
    first_name: str
    last_name: str
    birthday: str
    email: str
    hashed_password: str


class UserCreate(CustomModel):
    first_name: str
    last_name: str
    birthday: str
    email: str
    hashed_password: str


class UserUpdate(CustomModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    birthday: str | None = None
    email: str | None = None
