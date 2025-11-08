from fastapi import APIRouter

products_api_router = APIRouter()


# get one
@products_api_router.get("/{product_id}")
async def get_product():
    return


# get all
@products_api_router.get("/products")
async def get_product():
    return


# create
@products_api_router.post("/{product_id}")
async def get_product():
    return


# update
@products_api_router.patch("/{item_id}")
async def get_product():
    return


# delete
@products_api_router.delete("/{item_id}")
async def get_product():
    return
