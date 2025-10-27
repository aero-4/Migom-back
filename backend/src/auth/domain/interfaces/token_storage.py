import abc

from backend.src.auth.domain.entities import TokenData


class ITokenStorage(abc.ABC):

    @abc.abstractmethod
    async def store_token(self, token_data: TokenData) -> None: ...

    @abc.abstractmethod
    async def is_token_active(self, jti: str) -> bool: ...
