from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.models.user import User
from app.models.deal import Deal
from app.models.cart import Cart, Order
from app.models.vendor import Vendor

router = APIRouter(tags=["Admin"])

@router.get("/users")
async def get_all_users(db: Session = Depends(get_db)):
    """Get all users - simple view without PRO tools"""
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value if user.role else "unknown",
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]

@router.get("/deals")
async def get_all_deals(db: Session = Depends(get_db)):
    """Get all deals"""
    deals = db.query(Deal).all()
    return [
        {
            "id": deal.id,
            "title": deal.title,
            "restaurant_name": deal.restaurant_name,
            "price": deal.price,
            "quantity": deal.quantity,
            "is_active": deal.is_active,
            "created_at": deal.created_at.isoformat() if deal.created_at else None
        }
        for deal in deals
    ]

@router.get("/stats")
async def get_database_stats(db: Session = Depends(get_db)):
    """Get database statistics"""
    user_count = db.query(User).count()
    deal_count = db.query(Deal).count()
    cart_count = db.query(Cart).count()
    order_count = db.query(Order).count()
    vendor_count = db.query(Vendor).count()
    
    return {
        "users": user_count,
        "deals": deal_count,
        "cart_items": cart_count,
        "orders": order_count,
        "vendors": vendor_count
    }
