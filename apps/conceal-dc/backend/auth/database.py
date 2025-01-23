from typing import Optional
from datetime import datetime, timedelta
from uuid import uuid4
from boto3.dynamodb.conditions import Key
import boto3
import os

# AWS Services Configuration
REGION = 'us-east-1'
DYNAMODB_ENDPOINT = os.getenv('DYNAMODB_ENDPOINT', 'http://localhost:8000')

# DynamoDB Tables
OTP_TABLE_NAME = "OtpTable"
USERS_TABLE_NAME = "Users"

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb', endpoint_url=DYNAMODB_ENDPOINT, region_name=REGION)

# Get table references
otp_table = dynamodb.Table(OTP_TABLE_NAME)
users_table = dynamodb.Table(USERS_TABLE_NAME)

# Constants
OTP_EXPIRATION_MINUTES = 5

class DatabaseService:
    def __init__(self, dynamodb_resource=None):
        if not dynamodb_resource:
            raise ValueError("DynamoDB resource is required")
            
        self.dynamodb = dynamodb_resource
        self.otp_table = self.dynamodb.Table("OtpTable")
        self.users_table = self.dynamodb.Table("Users")

    def get_user_by_phone_number(self, phone_number: str) -> Optional[dict]:
        """Fetch a user by phone number using the PhoneNumberIndex."""
        response = self.users_table.query(
            IndexName="PhoneNumberIndex",
            KeyConditionExpression=Key("phone_number").eq(phone_number)
        )
        items = response.get("Items", [])
        return items[0] if items else None

    def get_user_by_email(self, email: str) -> Optional[dict]:
        """Fetch a user by email using the EmailIndex."""
        response = self.users_table.query(
            IndexName="EmailIndex",
            KeyConditionExpression=Key("email").eq(email)
        )
        items = response.get("Items", [])
        return items[0] if items else None

    def create_user(self, email: Optional[str], phone_number: Optional[str]) -> str:
        """Create a new user with a UUID."""
        user_id = str(uuid4())
        
        user_data = {
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat()
        }
        if email:
            user_data["email"] = email
        if phone_number:
            user_data["phone_number"] = phone_number

        self.users_table.put_item(Item=user_data)
        return user_id

    def store_otp(self, otp_id: str, otp_code: str) -> None:
        """Store the OTP code with a TTL."""
        expires_at = int((datetime.utcnow() + timedelta(minutes=5)).timestamp())
        self.otp_table.put_item(
            Item={
                "otp_id": otp_id,
                "otp_code": otp_code,
                "expires_at": expires_at
            }
        )

    def get_otp(self, otp_id: str) -> Optional[dict]:
        """Retrieve the OTP info."""
        response = self.otp_table.get_item(Key={"otp_id": otp_id})
        return response.get("Item")

    def delete_otp(self, otp_id: str) -> None:
        """Remove the OTP entry."""
        self.otp_table.delete_item(Key={"otp_id": otp_id}) 