import functools
from typing import Callable, Any

from fastapi import HTTPException

from src.auth.domain.entities import AnonymousUser
from src.core.domain.exceptions import PermissionDenied


class access_control:

    def __init__(self, superuser=False, open=False):
        self.current_user = None
        self.superuser = superuser
        self.open = open

    def __call__(self, function) -> Callable[..., Any]:

        @functools.wraps(function)
        async def decorated(*args, **kwargs):
            is_allowed = await self.verify_request(*args, **kwargs)
            if not is_allowed:
                raise HTTPException(403, "Not allowed")

            return await function(*args, **kwargs)

        return decorated

    async def parse_request(self, **kwargs):
        request = kwargs.get("request")
        user = getattr(request, "state", None) and getattr(request.state, "user", None)
        self.current_user = user if user is not None else AnonymousUser()
        return None

    async def verify_request(self, *args, **kwargs):
        if self.superuser and not self.current_user.is_super_user:
            raise PermissionDenied()

        if isinstance(self.current_user, AnonymousUser) and not self.open:
            raise AuthRequired()

        return True
