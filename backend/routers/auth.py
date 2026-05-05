from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth import create_access_token
from config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    email: str


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    if body.email != settings.ADMIN_EMAIL or body.password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token({"sub": body.email, "role": "admin"})
    return {"token": token, "email": body.email}
