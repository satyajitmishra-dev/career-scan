from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
async def register_user():
    return {"message": "User registered successfully"}

@router.post("/login")
async def login_user():
    return {"access_token": "fake-jwt-token", "token_type": "bearer"}
