from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class SecurityMiddleware(BaseHTTPMiddleware):

    def __init__(self, app):
        super().__init__(app)

        self.secure_paths = ["/api", "/admin", "/docs", "/redoc"]
        self.allowed_paths = ["/api/auth"]

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = str(request.url)

        is_allowed_paths = any(path in _ for _ in self.allowed_paths)
        is_secure_paths = any(path in _ for _ in self.secure_paths)

        if is_secure_paths and not is_allowed_paths:
            return JSONResponse(status_code=403,
                                content={"message": "Permission denied"})

        response = await call_next(request)

        return response
