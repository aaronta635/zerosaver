from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.schemas.deal import DealResponse, DealCreate
from app.models.deal import Deal
from datetime import datetime
import random

router = APIRouter()

def generate_unique_id():
    return f"deal_{random.randint(1000, 9999)}"

@router.get('/')
def get_deals(db: Session = Depends(get_db)):
    deals = db.query(Deal).all()
    return deals

@router.post("/", response_model = DealResponse)
def create_deal(deal: DealCreate, db: Session = Depends(get_db)):

    deal_id = generate_unique_id()

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
        ready_time=ready_time,  # You might need to parse this if it's a string
        is_active=True
    )

    db.add(db_deal)

    db.commit()

    db.refresh(db_deal)

    print("Done!")
    return db_deal