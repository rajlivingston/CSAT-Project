import os
import boto3
import shutil
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile
from dotenv import load_dotenv

# Ensure .env is loaded
load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
LOCAL_STORAGE_PATH = os.getenv("LOCAL_STORAGE_PATH", "screenshots")

class S3Client:
    def __init__(self):
        self.s3 = None
        if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
            try:
                self.s3 = boto3.client(
                    "s3",
                    aws_access_key_id=AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                    region_name=AWS_REGION
                )
            except Exception as e:
                print(f"Failed to initialize S3 client: {e}")
        self.bucket = AWS_BUCKET_NAME

    def upload_file(self, file: UploadFile, object_name: str = None) -> str:
        if object_name is None:
            object_name = file.filename

        # Read content once to avoid "closed file" or "consumed stream" issues
        try:
            file_content = file.file.read()
        except Exception as e:
            print(f"Error reading upload file: {e}")
            return None

        # Attempt S3 upload if configured
        if self.s3 and self.bucket:
            try:
                self.s3.put_object(
                    Bucket=self.bucket,
                    Key=object_name,
                    Body=file_content,
                    ContentType=file.content_type
                )
                file_url = f"https://{self.bucket}.s3.{AWS_REGION}.amazonaws.com/{object_name}"
                return file_url
            except Exception as e:
                print(f"S3 Upload failed, falling back to local: {e}")
        else:
            if not self.bucket:
                print("AWS_BUCKET_NAME is not set, falling back to local storage.")
            else:
                print("S3 credentials not fully configured, falling back to local storage.")

        # Local fallback logic
        try:
            if not os.path.exists(LOCAL_STORAGE_PATH):
                os.makedirs(LOCAL_STORAGE_PATH)
            
            file_path = os.path.join(LOCAL_STORAGE_PATH, object_name)
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            
            return file_path
        except Exception as e:
            print(f"Local storage fallback failed: {e}")
            return None
