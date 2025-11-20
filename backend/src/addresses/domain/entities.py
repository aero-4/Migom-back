from src.core.domain.entities import CustomModel


class Address(CustomModel):
    id: int
    user_id: int
    city: str
    street: str
    house_number: int
    entrance: int | None
    floor: int | None
    apartment_number: int | None
    comment: str | None
    is_leave_at_door: bool | None


class AddressCreate(CustomModel):
    user_id: int
    city: str
    street: str
    house_number: int
    entrance: int | None = None
    floor: int | None = None
    apartment_number: int | None = None
    comment: str | None = None
    is_leave_at_door: bool | None = None


class AddressUpdate(CustomModel):
    id: int
    city: str
    street: str
    house_number: int
    entrance: int
    floor: int
    apartment_number: int
    comment: str
    is_leave_at_door: bool
