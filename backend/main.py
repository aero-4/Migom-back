import logging

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from src.categories.presentation.api import categories_api_router
from src.core.infrastructure.redis import check_redis_connection
from src.db.utils import create_db_and_tables
from src.core.config import settings
from src.core.domain.exceptions import AppException

from src.auth.presentation.middlewares.security import SecurityMiddleware
from src.auth.presentation.middlewares.authentication import AuthenticationMiddleware
from src.auth.presentation.middlewares.jwtrefresh import JWTRefreshMiddleware
from src.auth.presentation.api import auth_api_router
from src.products.presentation.api import products_api_router
from src.users.presentation.api import users_api_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await check_redis_connection()
    # await create_db_and_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            **(exc.extra or {})
        }
    )


# app.add_middleware(SecurityMiddleware)
# app.add_middleware(AuthenticationMiddleware)
# app.add_middleware(JWTRefreshMiddleware)

Instrumentator().instrument(app).expose(app, endpoint='/__internal_metrics__')

app.include_router(auth_api_router, prefix='/api/auth', tags=["Authentication"])
app.include_router(users_api_router, prefix='/api/users', tags=["Users"])
app.include_router(categories_api_router, prefix="/api/categories", tags=["Categories"])
app.include_router(products_api_router, prefix='/api/products', tags=["Products"])

if __name__ == '__main__':
    uvicorn.run(app)