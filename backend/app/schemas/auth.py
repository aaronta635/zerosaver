from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import datetime

class RoleType(str, Enum):
    CUSTOMER = "customer"
    SHOP = "shop"
    ADMIN = "admin"

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: RoleType = RoleType.CUSTOMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: RoleType

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: RoleType
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[RoleType] = None
