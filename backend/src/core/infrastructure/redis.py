from functools import lru_cache

from redis.asyncio import Redis

from src.core.config import settings


@lru_cache
def get_redis_client() -> Redis:
    print(settings.REDIS_URL)
    return Redis.from_url(settings.REDIS_URL, decode_responses=True)
