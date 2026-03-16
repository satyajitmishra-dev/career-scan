import os
import boto3
from botocore.exceptions import ClientError
import uuid
import logging

logger = logging.getLogger(__name__)

class FileHandler:
    def __init__(self):
        self.bucket_name = os.environ.get("CLOUDFLARE_R2_BUCKET_NAME")
        self.endpoint_url = os.environ.get("CLOUDFLARE_R2_ENDPOINT_URL")
        self.access_key = os.environ.get("CLOUDFLARE_R2_ACCESS_KEY_ID")
        self.secret_key = os.environ.get("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
        
        # Only initialize s3 client if credentials exist, otherwise mock
        if self.bucket_name and self.endpoint_url and self.access_key and self.secret_key:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key
            )
        else:
            self.s3_client = None
            logger.warning("S3/R2 credentials not provided. Using local fallback/mock storage.")
            os.makedirs("storage/uploads", exist_ok=True)

    async def upload_file(self, file_content: bytes, original_filename: str) -> str:
        """Uploads a file and returns its assigned key or URL."""
        extension = original_filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{extension}"
        
        if self.s3_client:
            try:
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=unique_filename,
                    Body=file_content,
                    ContentType="application/pdf"
                )
                return f"{self.endpoint_url}/{self.bucket_name}/{unique_filename}"
            except ClientError as e:
                logger.error(f"Error uploading to R2: {e}")
                raise e
        else:
            # Fallback to local storage
            file_path = f"storage/uploads/{unique_filename}"
            with open(file_path, "wb") as f:
                f.write(file_content)
            return file_path

file_handler = FileHandler()
