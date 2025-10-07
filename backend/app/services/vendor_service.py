from sqlalchemy.orm import Session
from app.crud.vendor import create_vendor, get_vendor_by_user_id
from app.schemas.vendor import VendorCreate, VendorReturn
from app.models.user import User

class VendorService:
    def __init__(self, db: Session):
        self.db = db

    async def create_vendor(self, data_obj: VendorCreate, current_user: User) -> VendorReturn:
        # Check if user already has a vendor profile
        existing_vendor = get_vendor_by_user_id(self.db, current_user.id)
        if existing_vendor:
            raise ValueError("User already has a vendor profile")
        
        # Create vendor profile
        vendor = create_vendor(self.db, data_obj, current_user.id)
        return VendorReturn.from_orm(vendor)
