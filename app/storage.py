
import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

class S3Client:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION
        )
        self.bucket = AWS_BUCKET_NAME

    def upload_file(self, file: UploadFile, object_name: str = None) -> str:
        if object_name is None:
            object_name = file.filename

        try:
            self.s3.upload_fileobj(
                file.file,
                self.bucket,
                object_name,
                ExtraArgs={"ContentType": file.content_type}
            )
            # Generate public URL (assuming bucket is public or we use presigned URLs)
            # For now, let's construct the standard S3 URL
            file_url = f"https://{self.bucket}.s3.{AWS_REGION}.amazonaws.com/{object_name}"
            return file_url
        except NoCredentialsError:
            print("Credentials not available")
            return None
        except Exception as e:
            print(f"Error uploading file: {e}")
            return None
