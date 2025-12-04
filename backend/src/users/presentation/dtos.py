import datetime

from pydantic import Field

from src.core.domain.entities import CustomModel


class UserCreateDTO(CustomModel):
    email: str
    password: str
    first_name: str
    last_name: str
    birthday: datetime.date
    is_super_user: bool | None = False


class UserPasswordUpdateDTO(CustomModel):
    password: str = Field(min_length=8, max_length=32)
