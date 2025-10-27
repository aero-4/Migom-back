from pydantic import EmailStr, Field


class AuthUserDTO:
    email: EmailStr
    password: str = Field(min_length=8, max_length=32)
