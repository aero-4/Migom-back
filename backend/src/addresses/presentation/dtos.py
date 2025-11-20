from src.core.domain.entities import CustomModel


class AddressCreateDTO(CustomModel):
    city: str
    street: str
    house_number: int
    entrance: int | None
    floor: int | None
    apartment_number: int | None
    comment: str | None
    is_leave_at_door: bool | None


class AddressUpdateDTO(CustomModel):
    city: str | None
    street: str | None
    house_number: int | None
    entrance: int | None
    floor: int | None
    apartment_number: int | None
    comment: str | None
    is_leave_at_door: bool | None
