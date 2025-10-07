from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VendorCreate(BaseModel):
    business_name: str
    business_type: str
    description: Optional[str] = None
    address: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class VendorUpdate(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class VendorReturn(BaseModel):
    id: int
    user_id: int
    business_name: str
    business_type: str
    description: Optional[str]
    address: str
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    is_approved: bool
    rating: float
    total_deals: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
