import datetime

from src.core.domain.entities import CustomModel


class UserCreateDTO(CustomModel):
    email: str
    password: str
    first_name: str
    last_name: str
    birthday: datetime.date
