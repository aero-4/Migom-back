from src.products.infrasctructure.db.unit_of_work import PGProductUnitOfWork


async def collect_products(
        uow: PGProductUnitOfWork,
):
    async with uow:
        products = await uow.products.get_all()
        return products


async def collect_product(
        id_pk: int,
        uow: PGProductUnitOfWork,
):
    async with uow:
        product = await uow.products.get_one(id_pk)
        return product