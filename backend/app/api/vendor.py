from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.utils.services import get_vendor_service
from app.schemas.vendor import (
    VendorCreate,
    VendorReturn,
)
from app.services.vendor_service import VendorService
from app.models.user import User


router = APIRouter(tags=["Vendor"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=VendorReturn)
async def create_vendor(
    data_obj: VendorCreate,
    vendor_service: VendorService = Depends(get_vendor_service),
    user_id: int = 1,  # Simplified for now
):
    # Create a mock user object
    class MockUser:
        def __init__(self, user_id):
            self.id = user_id
    
    return await vendor_service.create_vendor(
        data_obj=data_obj, current_user=MockUser(user_id)
    )