from fastapi import APIRouter

payments_api_router = APIRouter()


@payments_api_router.post("/{order_id}")
async def create(order_id: int):
    return {"msg": "Payment created"}


@payments_api_router.get("/{order_id}")
async def get_all(order_id: int):
    return {"msg": "Payment get all"}


@payments_api_router.patch("/{order_id}")
async def update(order_id: int):
    return {"msg": "Payment updated"}


@payments_api_router.delete("/{order_id}")
async def delete(order_id: int):
    return {"msg": "Payment deleted"}
