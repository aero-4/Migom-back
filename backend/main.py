import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from sqladmin import Admin
from starlette.staticfiles import StaticFiles

from src.core.config import settings
from src.core.domain.exceptions.exceptions import AppException
import src.core.infrastructure.logging_setup

from src.auth.presentation.middlewares import SecurityMiddleware, AuthenticationMiddleware, JWTRefreshMiddleware
from src.auth.presentation.api import auth_api_router
from src.auth.presentation.views import auth_view_router
from src.users.presentation.api import UserCRUDRouter, user_api_router
from src.users.presentation.admin import UserAdmin
from src.db.engine import engine
from src.integrations.infrastructure.http.aiohttp_client import AiohttpClient


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    AiohttpClient.get_aiohttp_client()
    # await create_db_and_tables()  # Only needed if Alembic is not used
    yield
    await AiohttpClient.close_aiohttp_client()


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


app.add_middleware(SecurityMiddleware)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(JWTRefreshMiddleware)

Instrumentator().instrument(app).expose(app, endpoint='/__internal_metrics__')

app.include_router(auth_api_router, prefix='/api/auth', tags=["auth"])
