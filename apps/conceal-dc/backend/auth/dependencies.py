from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from .token_utils import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode and validate the JWT token."""
    payload = verify_token(token, "access")
    return {
        "user_id": payload.get("user_id"),
        "otp_id": payload.get("sub")
    } 