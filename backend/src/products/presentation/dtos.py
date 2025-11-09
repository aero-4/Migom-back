from pydantic import BaseModel

from src.categories.domain.entities import Category


class ProductCreateDTO(BaseModel):
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
