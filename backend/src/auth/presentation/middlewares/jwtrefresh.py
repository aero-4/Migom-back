from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class JWTRefreshMiddleware(BaseHTTPMiddleware): ...