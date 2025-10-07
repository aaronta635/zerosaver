from sqlalchemy.orm import Session
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate
from typing import List, Optional
from datetime import datetime

def create_vendor(db: Session, vendor_data: VendorCreate, user_id: int):
    db_vendor = Vendor(
        user_id=user_id,
        business_name=vendor_data.business_name,
        business_type=vendor_data.business_type,
        description=vendor_data.description,
        address=vendor_data.address,
        phone=vendor_data.phone,
        email=vendor_data.email,
        website=vendor_data.website,
        is_approved=False,
        rating=0.0,
        total_deals=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def get_vendor(db: Session, vendor_id: int) -> Optional[Vendor]:
    return db.query(Vendor).filter(Vendor.id == vendor_id).first()

def get_vendor_by_user_id(db: Session, user_id: int) -> Optional[Vendor]:
    return db.query(Vendor).filter(Vendor.user_id == user_id).first()

def get_vendors(db: Session, skip: int = 0, limit: int = 100) -> List[Vendor]:
    return db.query(Vendor).offset(skip).limit(limit).all()

def update_vendor(db: Session, vendor_id: int, vendor_data: VendorUpdate):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor:
        update_data = vendor_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(vendor, field, value)
        vendor.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(vendor)
        return vendor
    return None

def delete_vendor(db: Session, vendor_id: int):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor:
        db.delete(vendor)
        db.commit()
        return True
    return False

def approve_vendor(db: Session, vendor_id: int):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor:
        vendor.is_approved = True
        vendor.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(vendor)
        return vendor
    return None

def get_approved_vendors(db: Session) -> List[Vendor]:
    return db.query(Vendor).filter(Vendor.is_approved == True).all()
