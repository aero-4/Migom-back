import datetime
from uuid import UUID

from src.core.domain.entities import CustomModel


class Category(CustomModel):
    id: int
    uuid: UUID
    name: str
    slug: str
    photo: str


class CategoryCreate(CustomModel):
    name: str
    slug: str
    photo: str


class CategoryUpdate(CustomModel):
    uuid: UUID
    name: str | None = None
    photo: str | None = None
