import uuid
from pathlib import Path

import pytest

from src.core.infrastructure.s3 import S3Storage

ACCESS_KEY = "39c0e727e91142d5a4a6942b11363688"
SECRET_KEY = "3aed151a547640558c615ff156d78747"
ENDPOINT_URL = "https://s3.ru-7.storage.selcloud.ru"
URL = "https://8603c7a9-1ca2-4da3-a023-1f3b1fb8392a.selstorage.ru"
BUCKET_NAME = "migom-public-bucket"


@pytest.mark.asyncio
async def test_upload_file():
    s3_client = S3Storage(
        access_key=ACCESS_KEY, secret_key=SECRET_KEY, endpoint_url=ENDPOINT_URL, bucket_name=BUCKET_NAME
    )
    image = Path(f"files/test-image.png")

    assert await s3_client.upload_file(image) is None  # Path
    assert await s3_client.upload_file(str(image)) is None  # str


@pytest.mark.asyncio
async def test_random_object_name_upload_file():
    s3_client = S3Storage(
        access_key=ACCESS_KEY, secret_key=SECRET_KEY, endpoint_url=ENDPOINT_URL, bucket_name=BUCKET_NAME, public_url=URL
    )
    random_name = "random_name_" + uuid.uuid4().hex
    image = Path(f"files/test-image.png")

    uploaded = await s3_client.upload_file(image, random_name)
    assert uploaded == f"{URL}/{random_name}.png"
