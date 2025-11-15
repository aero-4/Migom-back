from fastapi import APIRouter, File, UploadFile

from src.files.application.use_cases.upload_file import upload_file
from src.files.presentation.dependencies import S3StorageDep

files_api_router = APIRouter()


@files_api_router.post(f"/", description="Upload files on S3 Storage selectel.ru")
async def upload(storage: S3StorageDep, file: UploadFile = File(..., max_size=1024 * 1024 * 10)):
    return await upload_file(file, storage)

