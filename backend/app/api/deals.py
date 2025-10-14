from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.schemas.deal import DealResponse, DealCreate
from app.models.deal import Deal
from datetime import datetime
import random
import os
import shutil
import uuid
from pathlib import Path

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def generate_unique_id():
    return f"deal_{random.randint(1000, 9999)}"

@router.post("/upload-image/")
async def upload_deal_image(file: UploadFile = File(...)):
    """Upload an image for a deal"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path
        return {"image_url": f"/api/deals/images/{unique_filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.get("/images/{filename}")
async def get_deal_image(filename: str):
    """Serve uploaded deal images"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)

@router.get('/')
@router.get('')  # Handle both /api/deals/ and /api/deals
def get_deals(db: Session = Depends(get_db)):
    deals = db.query(Deal).all()
    return deals

@router.post("/", response_model = DealResponse)
def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    try:
        deal_id = generate_unique_id()

        # Parse datetime - handle both with and without timezone
        if deal.ready_time.endswith('Z'):
            ready_time = datetime.fromisoformat(deal.ready_time.replace('Z', '+00:00'))
        else:
            ready_time = datetime.fromisoformat(deal.ready_time)
        
        db_deal = Deal(
            id = deal_id,
            title = deal.title,
            restaurant_name = deal.restaurant_name,
            description=deal.description,
            price=deal.price,
            quantity=deal.quantity,
            pickup_address=deal.pickup_address,
            image_url=deal.image_url,
            ready_time=ready_time,
            is_active=True
        )

        db.add(db_deal)
        db.commit()
        db.refresh(db_deal)

        return db_deal
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")