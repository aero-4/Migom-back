from pydantic import EmailStr, Field

from backend.src.core.domain.entities import CustomModel


class AuthUserDTO(CustomModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=32)
