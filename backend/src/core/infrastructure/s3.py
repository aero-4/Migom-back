import uuid6

from contextlib import asynccontextmanager
from aiobotocore.session import get_session, ClientCreatorContext
from pathlib import Path


class S3Storage:
    def __init__(self, access_key: str, secret_key: str, endpoint_url: str, bucket_name: str, public_url: str = None):
        self.bucket_name = bucket_name
        self.public_url = public_url
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url
        }
        self.session = get_session()

    @asynccontextmanager
    async def get_client(self) -> ClientCreatorContext:
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    async def upload_file(self, file_path: str | Path, object_name: str = str(uuid6.uuid6())) -> None | str:
        async with self.get_client() as client:
            suffix = file_path.split(".")[-1] if isinstance(file_path, str) else file_path.suffix.replace(".", "")
            object_name = f"{object_name}.{suffix}"

            with open(file_path, "rb") as file:
                await client.put_object(Bucket=self.bucket_name, Key=object_name, Body=file)

        if self.public_url:
            return f"{self.public_url}/{object_name}"

        return None
