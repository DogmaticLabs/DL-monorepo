from datetime import datetime, timedelta
import random
import string
import jwt
from fastapi import HTTPException
from .config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    OTP_LENGTH
)

def generate_otp_code(length: int = OTP_LENGTH) -> str:
    """Generate a random numeric OTP of given length."""
    return ''.join(random.choices(string.digits, k=length))

def generate_tokens(user_id: str, otp_id: str):
    """Generate an access token and a refresh token."""
    now = datetime.utcnow()
    
    # Access Token
    access_payload = {
        "sub": otp_id,
        "user_id": user_id,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access"
    }
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)

    # Refresh Token
    refresh_payload = {
        "sub": otp_id,
        "user_id": user_id,
        "iat": now,
        "exp": now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)

    return access_token, refresh_token

def verify_token(token: str, token_type: str = "access"):
    """Verify and decode a JWT token."""
    if not token:  # This checks for None, empty string, and whitespace
        raise HTTPException(status_code=401, detail="Token is required")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Verify token type
        if payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail=f"Invalid token type. Expected {token_type}")
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token") 