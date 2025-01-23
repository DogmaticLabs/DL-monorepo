from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime, timedelta

from .schemas import OtpRequest, OtpVerifyRequest, RefreshTokenRequest
from .token_utils import generate_otp_code, generate_tokens, verify_token
from .notifications import NotificationService
from .database import DatabaseService
from .dependencies import get_current_user

router = APIRouter()

# Services will be injected from api.py
db_service = None
notification_service = None

def init_services(db: DatabaseService, notifications: NotificationService):
    global db_service, notification_service
    db_service = db
    notification_service = notifications

# Auth Routes
@router.post("/request-otp")
async def request_otp(payload: OtpRequest):
    """Generate and send OTP via email or SMS."""
    if not payload.email and not payload.phone_number:
        raise HTTPException(status_code=400, detail="Must provide an email or phone number.")
    
    # Get or create user
    user = None
    if payload.email:
        user = db_service.get_user_by_email(payload.email)
    elif payload.phone_number:
        user = db_service.get_user_by_phone_number(payload.phone_number)
    
    if not user:
        user_id = db_service.create_user(payload.email, payload.phone_number)
    else:
        user_id = user["user_id"]

    # Generate and store OTP
    otp_code = generate_otp_code()
    otp_id = payload.phone_number if payload.phone_number else payload.email
    db_service.store_otp(otp_id, otp_code)

    # Send OTP
    try:
        if payload.phone_number:
            notification_service.send_otp_via_sns(payload.phone_number, otp_code)
        else:
            notification_service.send_otp_via_ses(payload.email, otp_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")

    return {
        "message": "OTP sent successfully",
        "otp_id": otp_id,
    }

@router.post("/verify-otp")
async def verify_otp(payload: OtpVerifyRequest):
    """Verify OTP and return authentication tokens."""
    otp_item = db_service.get_otp(payload.otp_id)
    
    if not otp_item:
        raise HTTPException(status_code=404, detail="OTP not found or expired")

    if otp_item["otp_code"] != payload.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    db_service.delete_otp(payload.otp_id)

    # Get user
    user = None
    if "@" in payload.otp_id:
        user = db_service.get_user_by_email(payload.otp_id)
    else:
        user = db_service.get_user_by_phone_number(payload.otp_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token, refresh_token = generate_tokens(user["user_id"], payload.otp_id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh-token")
async def refresh_token(payload: RefreshTokenRequest):
    """Exchange refresh token for new access and refresh tokens."""
    token_payload = verify_token(payload.refresh_token, "refresh")
    
    access_token, refresh_token = generate_tokens(
        token_payload["user_id"],
        token_payload["sub"]
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    """Protected route example."""
    return {
        "message": f"Welcome! User ID: {current_user['user_id']}"
    } 