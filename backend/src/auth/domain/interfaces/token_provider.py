import abc

from backend.src.auth.domain.entities import TokenData


class ITokenProvider(abc.ABC):

    def create_access_token(self, data: dict) -> TokenData: ...

    def create_refresh_token(self, data: dict) -> TokenData: ...

    def read_token(self, data: dict) -> TokenData | None: ...
