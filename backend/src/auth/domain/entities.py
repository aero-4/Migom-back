import datetime

from backend.src.core.domain.entities import CustomModel


class TokenType(CustomModel):
    access: str | None = None
    refresh: str | None = None


class TokenData(CustomModel):
    user_id: int
    iss: str
    jti: str
    exp: datetime.datetime
