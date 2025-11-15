from typing import BinaryIO

import aiofiles
import httpx
import pytest
from fastapi import UploadFile

from src.files.application.use_cases.upload_file import upload_file
from src.files.domain.entities import FileData
from src.files.presentation.dependencies import S3StorageDep


@pytest.mark.asyncio
async def test_success_upload_file(clear_db, s3_storage):
    TEST_FILE_NAME = "test_photo.jpeg"

    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        with open(TEST_FILE_NAME, "rb") as f:
            upload = UploadFile(filename=TEST_FILE_NAME, file=f)

            await s3_storage.save_file(TEST_FILE_NAME, upload)
            url = await s3_storage.upload_file(TEST_FILE_NAME, TEST_FILE_NAME.split(".")[0])

            created_file_name = url.split("/")[-1]

        assert created_file_name == TEST_FILE_NAME


@pytest.mark.asyncio
async def test_not_found_file_upload_file(clear_db, s3_storage):
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        random_file_name = "random_file.jpeg"

        with pytest.raises(FileNotFoundError):

            with open(random_file_name, "rb") as f:
                upload = UploadFile(filename=random_file_name, file=f)
