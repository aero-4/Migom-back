from src.categories.domain.entities import CategoryCreate
from src.categories.infrastructure.db.unit_of_work import PGCategoryUnitOfWork
from src.categories.presentation.dtos import CategoryCreateDTO
from src.utils.strings import generate_slug


async def add_category(
    category_data: CategoryCreateDTO,
    uow: PGCategoryUnitOfWork,
):
    category_data = CategoryCreate(
        **category_data.model_dump(mode="json"),
        slug=generate_slug(category_data.name)
    )
    async with uow:
        category = await uow.categories.add(category_data)
        await uow.commit()
        return category
