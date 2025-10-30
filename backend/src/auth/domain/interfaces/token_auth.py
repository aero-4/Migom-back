import abc

from src.auth.domain.entities import TokenType
from src.auth.domain.interfaces.token_provider import ITokenProvider
from src.auth.domain.interfaces.token_storage import ITokenStorage
from src.users.domain.entities import User


class ITokenAuth(abc.ABC):

    def __init__(self, token_provider: ITokenProvider, token_storage: ITokenStorage | None = None):
        self.token_provider = token_provider
        self.token_storage = token_storage

    @abc.abstractmethod
    async def set_token(self, token: str, type: TokenType): ...

    @abc.abstractmethod
    async def set_tokens(self, user: User): ...
