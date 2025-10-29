import abc
from typing import Type, Any, no_type_check, ClassVar

from sqladmin.exceptions import InvalidModelError
from sqladmin.helpers import get_primary_keys, slugify_class_name, prettify_class_name
from sqlalchemy import inspect
from sqlalchemy.exc import NoInspectionAvailable
from sqlalchemy.orm import sessionmaker

from backend.src.db.engine import async_session_maker


class CRUDBaseMeta(type):
    @no_type_check
    def __new__(mcls, name, bases, attrs: dict, **kwargs: Any):
        cls: Type["CRUDBase"] = super().__new__(mcls, name, bases, attrs)

        model = kwargs.get("model")

        if not model:
            return cls

        try:
            inspect(model)
        except NoInspectionAvailable:
            raise InvalidModelError(
                f"Class {model.__name__} is not a SQLAlchemy model."
            )

        cls.pk_columns = get_primary_keys(model)
        cls.identity = slugify_class_name(model.__name__)
        cls.model = model
        cls.session_maker = async_session_maker

        cls.name = attrs.get("name", prettify_class_name(cls.model.__name__))
        cls.name_plural = attrs.get("name_plural", f"{cls.name}s")
        return cls


class CRUDBase(metaclass=CRUDBaseMeta):
    session_maker: ClassVar[sessionmaker | async_session_maker]
