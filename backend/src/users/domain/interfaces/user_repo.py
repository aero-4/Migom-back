import abc

from src.users.domain.entities import UserCreate, User, UserUpdate


class IUserRepository(abc.ABC):

    @abc.abstractmethod
    def add(self, user: UserCreate) -> User:
        """
        Add new user to repository
        """
        pass

    @abc.abstractmethod
    def get_by_email(self, email: str) -> User:
        """
        Get user by email
        """
        pass

    @abc.abstractmethod
    def get_by_id(self, id: int) -> User:
        """
        Get user by id
        """
        pass

    @abc.abstractmethod
    def delete(self, id: int) -> bool:
        """
        Delete user by id
        """
        pass

    @abc.abstractmethod
    def update(self, user_update: UserUpdate) -> User:
        """
        Updates user attributes
        """
        pass

