from src.users.infrastructure.services.password_hasher import BcryptPasswordHasher


def get_password_hasher():
    return BcryptPasswordHasher()
