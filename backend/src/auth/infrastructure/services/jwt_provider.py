import uuid
from datetime import timedelta

from jose import jwt, JWTError
from pydantic import SecretStr
from starlette.responses import Response
from starlette.requests import Request

from src.auth.config import auth_settings
from src.auth.domain.entities import TokenData, TokenType
from src.auth.domain.interfaces.token_auth import ITokenAuth
from src.auth.domain.interfaces.token_provider import ITokenProvider
from src.auth.domain.interfaces.token_storage import ITokenStorage
from src.auth.infrastructure.transports.base import IAuthTransport
from src.users.domain.entities import User
from src.utils.datetimes import get_timezone_now


class JWTProvider(ITokenProvider):

    def create_access_token(self, data: dict) -> str:
        return self._encode_jwt(data=data, secret=auth_settings.JWT_PRIVATE_KEY, expire_seconds=auth_settings.ACCESS_TOKEN_EXPIRE_SECONDS)

    def create_refresh_token(self, data: dict) -> str:
        return self._encode_jwt(data=data, secret=auth_settings.JWT_PRIVATE_KEY, expire_seconds=auth_settings.REFRESH_TOKEN_EXPIRE_SECONDS)

    def read_token(self, token: str) -> TokenData | None:
        if not token:
            return None

        try:
            data = self._decode_jwt(token, secret=auth_settings.JWT_PUBLIC_KEY)
            if not data.get("user_id"):
                return None

            return TokenData(**data)
        except JWTError:
            return None

    def _encode_jwt(self, data: dict, secret: SecretStr | str, algorithm: str = auth_settings.JWT_ALGORITHM, expire_seconds: int | None = None) -> str:
        payload = data.copy()

        if expire_seconds:
            payload["exp"] = get_timezone_now() + timedelta(seconds=expire_seconds)

        payload["jti"] = str(uuid.uuid4())
        payload["iss"] = auth_settings.JWT_ISSUER

        return jwt.encode(payload, key=self._get_secret_value(secret), algorithm=algorithm)

    def _decode_jwt(self, payload: str, secret: SecretStr | str, algorithm: str = auth_settings.JWT_ALGORITHM, issuer: str = auth_settings.JWT_ISSUER):
        return jwt.decode(payload, key=self._get_secret_value(secret), algorithms=[algorithm], issuer=issuer)

    def _get_secret_value(self, secret: str | SecretStr):
        if isinstance(secret, SecretStr):
            return secret.get_secret_value()
        return secret


class JWTAuth(ITokenAuth):
    """
    Implementation of ITokenAuth for handling JWT-based authentication.

    Provides methods to issue, revoke, refresh, and retrieve access/refresh tokens
    from the request/response cycle.
    Integrates with a token storage backend for additional validation like token revocation.
    """

    def __init__(
            self,
            token_provider: ITokenProvider,
            transports: dict[TokenType, list[IAuthTransport]],
            token_storage: ITokenStorage | None = None,
            request: Request | None = None,
            response: Response | None = None
    ):
        super().__init__(token_provider, token_storage)
        self.transports = transports
        self.request = request
        self.response = response

    async def set_tokens(self, user: User) -> None:
        data = {
            "user_id": str(user.id),
        }
        access_token = self.token_provider.create_access_token(data)
        refresh_token = self.token_provider.create_refresh_token(data)
        await self.set_token(access_token, TokenType.ACCESS)
        await self.set_token(refresh_token, TokenType.REFRESH)


    async def set_token(self, token: str, token_type: TokenType) -> None:
        for transport in self._get_transports(token_type):
            transport.set_token(self.response, token)

        if self.token_storage:
            await self.token_storage.store_token(self.token_provider.read_token(token))

    async def read_token(self, token_type: TokenType) -> TokenData | None:
        token = self._get_access_token() if token_type == TokenType.ACCESS else self._get_refresh_token()
        token_data = self.token_provider.read_token(token)
        return await self._validate_token_or_none(token_data)

    async def _validate_token_or_none(self, token_data: TokenData) -> TokenData | None:
        if not token_data:
            return None

        if token_data.jti and self.token_storage:
            is_active = await self.token_storage.is_token_active(token_data.jti)
            if not is_active:
                return None
        return token_data

    def _get_transports(self, transport_type: TokenType) -> list[IAuthTransport]:
        for token_type, transports in self.transports.items():
            if token_type == transport_type:
                return transports
        return []

    def _get_access_token(self) -> str | None:
        if hasattr(self.request.state, "access_token"):
            return self.request.state.access_token

        for transport in self._get_transports(TokenType.ACCESS):
            token = transport.get_token(self.request)
            if token is not None:
                return token

    def _get_refresh_token(self) -> str | None:
        for transport in self._get_transports(TokenType.REFRESH):
            token = transport.get_token(self.request)
            if token is not None:
                return token
