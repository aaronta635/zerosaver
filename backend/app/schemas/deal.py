from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DealCreate(BaseModel):
    title: str
    restaurant_name: str
    description: str
    price: int
    quantity: int
    pickup_address: str
    image_url: Optional[str] = None
    ready_time: str

class DealResponse(BaseModel):
    id: str
    title: str
    restaurant_name: str
    description: str
    price: int
    quantity: int
    pickup_address: str
    image_url: str
    is_active: bool
    ready_time: datetime
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True