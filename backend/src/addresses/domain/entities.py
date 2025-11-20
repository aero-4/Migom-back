from src.core.domain.entities import CustomModel


class Address(CustomModel):
    id: int
    user_id: int
    city: str
    street: str
    house_number: int
    entrance: int
    floor: int
    apartment_number: int
    comment: str
    is_leave_at_door: bool


class AddressCreate(CustomModel):
    user_id: int
    city: str
    street: str
    house_number: int
    entrance: int
    floor: int
    apartment_number: int
    comment: str
    is_leave_at_door: bool


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
