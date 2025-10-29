from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from backend.src.core.config import settings
from backend.src.db.base import Base

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata


def get_database_url():
    return settings.DATABASE_URI + "?async_fallback=True"


def run_migrations_offline() -> None:
    context.configure(
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        url=get_database_url(),
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.url",
        poolclass=pool.NullPool,
        url=get_database_url()
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
