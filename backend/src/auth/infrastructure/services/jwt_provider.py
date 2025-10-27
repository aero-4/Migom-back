import uuid
from datetime import timedelta

from jose import jwt, JWTError
from pydantic import SecretStr

from backend.src.auth.config import auth_settings
from backend.src.auth.domain.entities import TokenData
from backend.src.auth.domain.interfaces.token_auth import ITokenAuth
from backend.src.auth.domain.interfaces.token_provider import ITokenProvider
from backend.src.utils.datetimes import get_timezone_now


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

        payload["jti"] = uuid.uuid4()
        payload["iss"] = auth_settings.JWT_ISSUER

        return jwt.encode(payload, key=self._get_secret_value(secret), algorithm=[algorithm])

    def _decode_jwt(self, payload: str, secret: SecretStr | str, algorithm: str = auth_settings.JWT_ALGORITHM, issuer: str = auth_settings.JWT_ISSUER):
        return jwt.decode(payload, key=self._get_secret_value(secret), algorithms=[algorithm], issuer=issuer)

    def _get_secret_value(self, secret: str | SecretStr):
        if isinstance(secret, SecretStr):
            return secret.get_secret_value()
        return secret


class JWTAuth(ITokenAuth):
    ...
