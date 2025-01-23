from pydantic import BaseModel, EmailStr
from typing import Optional

class OtpRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class OtpVerifyRequest(BaseModel):
    otp_id: str
    otp_code: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str 