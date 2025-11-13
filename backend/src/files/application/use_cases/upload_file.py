import aiofiles
from fastapi import UploadFile

from src.files.domain.entities import FileData
from src.files.presentation.dependencies import S3StorageDep


async def upload_file(file: UploadFile, storage: S3StorageDep) -> FileData:
    file_name = file.filename

    await storage.save_file(file_name, file.file)
    url = await storage.upload_file(file_name)
    await file.seek(0)

    return FileData(url=url)
