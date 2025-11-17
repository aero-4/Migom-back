from sqlalchemy import text

from src.db.base import Base
from src.db.engine import engine


async def drop_all_tables_cascade():
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(text(f'DROP TABLE IF EXISTS "{table.name}" CASCADE'))


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
