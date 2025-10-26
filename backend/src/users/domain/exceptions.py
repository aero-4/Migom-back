from backend.src.core.domain.exceptions import NotAuthenticated


class ErrorCode:
    AUTHENTICATION_REQUIRED = "Authentication required"
    AUTHORIZATION_FAILED = "Authorization failed. User has no access"
    INVALID_TOKEN = "Invalid token"
    INVALID_CREDENTIALS = "Invalid email or password"
    EMAIL_TAKEN = "Email is already taken"
    REFRESH_TOKEN_NOT_VALID = "Refresh token is not valid"
    REFRESH_TOKEN_REQUIRED = "Refresh token is required either in the body or cookie"


class InvalidCredentials(NotAuthenticated):
    detail = ErrorCode.INVALID_CREDENTIALS
