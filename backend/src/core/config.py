import os
import secrets
from typing import Literal

from pydantic import AnyHttpUrl, EmailStr, PostgresDsn, field_validator, ValidationInfo, AnyUrl, ConfigDict
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = os.environ.get("PROJECT_NAME", "Migom")
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    DOMAIN: str = os.environ.get("DOMAIN", "")
    SSL_ENABLED: bool = os.environ.get("SSL_ENABLED", False)
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS")
    def assemble_cors_origins(cls, v: str | list[str]) -> str | list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    DB_TYPE: Literal['POSTGRESQL', 'ASYNC_POSTGRESQL', 'SQLITE', 'ASYNC_SQLITE'] = os.environ.get("DB_TYPE", "ASYNC_POSTGRESQL")

    DB_NAME: str = os.environ.get("DB_NAME", "migom")
    DB_USER: str | None = os.environ.get("DB_USER", "postgres")
    DB_PASSWORD: str | None = os.environ.get("DB_PASSWORD", "hookklo")
    DB_HOST: str | None = os.environ.get("DB_HOST", "localhost")
    DB_PORT: str | None = os.environ.get("DB_PORT", "5432")
    DATABASE_URI: AnyUrl | None = None
    REDIS_URI: AnyUrl | None = os.environ.get("REDIS_URL")

    @staticmethod
    def _build_dsn(scheme: str, values: dict) -> str:
        return str(
            PostgresDsn.build(
                scheme=scheme,
                username=values.get("DB_USER"),
                password=values.get("DB_PASSWORD"),
                host=values.get("DB_HOST"),
                port=int(values["DB_PORT"]) if values.get("DB_PORT") else None,
                path=values.get("DB_NAME"),
            )
        )

    @field_validator("DATABASE_URI", mode="after")
    def assemble_db_connection(cls, v: str | None, info: ValidationInfo) -> str:
        if os.environ.get("ENVIRONMENT") == "testing":
            db_name = os.getenv("DB_NAME")
            db_host = os.getenv("DB_HOST")
            if "test" not in db_name and "test" not in db_host:
                raise RuntimeError("Testing mode enabled, but DB_NAME and DB_HOST does not look like test database.")

        if isinstance(v, str):
            return v
        db_type = info.data.get("DB_TYPE")
        if db_type == "SQLITE":
            return f"sqlite:///{info.data.get('DB_NAME')}.db"
        elif db_type == "ASYNC_SQLITE":
            return f"sqlite+aiosqlite:///{info.data.get('DB_NAME')}.db"
        elif db_type == "POSTGRESQL":
            return cls._build_dsn("postgresql+psycopg", info.data)
        elif db_type == "ASYNC_POSTGRESQL":
            return cls._build_dsn("postgresql+asyncpg", info.data)
        raise ValueError("Unsupported database type")

    SMTP_TLS: bool = True
    SMTP_PORT: int | None = None
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAIL_FROM: EmailStr | None = None

    model_config = ConfigDict()


settings = Settings()
