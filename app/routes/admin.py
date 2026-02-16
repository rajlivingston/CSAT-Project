
from fastapi import APIRouter, Body, HTTPException, status
from app.schemas import LoginRequest
from app.auth import create_token

router = APIRouter()

@router.post("/login")
def login(login_req: LoginRequest = Body(...)):
    if login_req.username == "Raj Livingston" and login_req.password == "Livingston2003":
        access_token = create_token({"sub": login_req.username})
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )