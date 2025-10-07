from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CartCreate(BaseModel):
    product_id: str  # Changed to string
    quantity: int = 1

class CartUpdate(BaseModel):
    product_id: str  # Changed to string
    quantity: int

class CartReturn(BaseModel):
    id: int
    customer_id: int
    product_id: str  # Changed to string
    quantity: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CartUpdateReturn(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CartItem(BaseModel):
    product_id: str  # Changed to string
    title: str
    price: float
    quantity: int
    total: float

class CartSummary(BaseModel):
    items: List[CartItem]
    total_items: int
    total_amount: float

class CheckoutCreate(BaseModel):
    payment_method: str = "card"
    delivery_address: Optional[str] = None

class PaymentVerified(BaseModel):
    payment_ref: str
    status: str
    amount: float
    order_id: int
