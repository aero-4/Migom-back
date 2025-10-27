from backend.src.users.infrasctructure.services.password_hasher import BcryptPasswordHasher


def get_password_hasher():
    return BcryptPasswordHasher()
