from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import timedelta
from app.database import supabase
from app.core.security import create_access_token
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

class LoginRequest(BaseModel):
    user_id: str
    user_pin: str

@router.post("/auth/login")
def login(data: LoginRequest):
    res = supabase.table("login_info").select("*").eq("user_id", data.user_id).execute()
    users = res.data
    if not users:
        raise HTTPException(status_code=401, detail="Invalid user_id")
    
    user = users[0]

    if user["user_pin"] != data.user_pin:
        raise HTTPException(status_code=401, detail="Invalid user_pin")

    access_token = create_access_token(
        data={"user_id": user["user_id"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "name": user["name"]
    }
