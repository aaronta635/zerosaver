from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_name = Column(String, nullable=False)
    business_type = Column(String, nullable=False)  # Restaurant, Bakery, Cafe, etc.
    description = Column(Text)
    address = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    is_approved = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    total_deals = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    
    # Relationships
    # user = relationship("User", back_populates="vendor_profile")  # Temporarily commented out
    # deals = relationship("Deal", back_populates="vendor")  # Temporarily commented out
