from pydantic import BaseModel

from src.products.domain.entities import ProductUpdate


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


class ProductUpdateDTO(BaseModel):
    name: str | None = None
    content: str | None = None
    composition: str | None = None
    price: float | None = None
    discount_price: float | None = None
    discount: int | None = None
    count: int | None = None
    grams: int | None = None
    protein: int | None = None
    fats: int | None = None
    carbohydrates: int | None = None
    photo: str | None = None
    category_id: int | None = None

    def to_entity(self, id: int):
        return ProductUpdate(id=id, **self.model_dump(exclude_unset=True))

