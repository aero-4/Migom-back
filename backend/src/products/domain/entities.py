from src.categories.domain.entities import Category
from src.core.domain.entities import CustomModel


class Product(CustomModel):
    id: int
    name: str
    content: str
    composition: str
    price: float
    discount_price: float | None = None
    discount: int | None = None
    count: int
    grams: int
    protein: int
    fats: int
    carbohydrates: int
    photo: str | None = None
    category_id: int


class ProductCreate(CustomModel):
    name: str
    content: str
    composition: str
    price: float
    discount_price: float | None = None
    discount: int | None = None
    count: int
    grams: int
    protein: int
    fats: int
    carbohydrates: int
    photo: str | None = None
    category_id: int
