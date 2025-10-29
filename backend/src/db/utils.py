from backend.src.db.base import Base
from backend.src.db.engine import engine


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)