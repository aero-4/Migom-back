from backend.src.users.domain.interfaces.user_uow import IUserUnitOfWork
from backend.src.users.infrastructure.db.unit_of_work import PGUserUnitOfWork


def get_user_uow() -> IUserUnitOfWork:
    return PGUserUnitOfWork()