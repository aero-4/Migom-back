import redis.asyncio as redis
from functools import lru_cache

from backend.src.core.config import settings


@lru_cache
def get_redis_client() -> redis.Redis:
    return redis.from_url(url=settings.REDIS_URI)