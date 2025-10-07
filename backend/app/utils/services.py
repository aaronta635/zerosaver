from fastapi import Depends
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.services.cart_service import CartService
from app.services.vendor_service import VendorService

def get_cart_service(db: Session = Depends(get_db)) -> CartService:
    return CartService(db)

def get_vendor_service(db: Session = Depends(get_db)) -> VendorService:
    return VendorService(db)
