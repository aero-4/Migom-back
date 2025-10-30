import datetime
import enum

from src.core.domain.entities import CustomModel


class TokenType(str, enum.Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenData(CustomModel):
    user_id: int
    aud: str | None = None
    iss: str | None = None
    jti: str | None = None
    exp: datetime.datetime
