"""Vendor Schema"""

from __future__ import annotations
from typing import Optional
from pydantic import AnyHttpUrl, BaseModel, Field

from schemas.base import CreateBaseModel, CustomerVendorReturnBase
from schemas.order import OrderItemsReturn, OrderReturn


class VendorCreate(CreateBaseModel):
    bio: str
    profile_picture: Optional[AnyHttpUrl] = None
    ratings: Optional[int] = Field(ge=0, le=5)
    order_time: Optional[str] = None


class VendorReturn(CustomerVendorReturnBase):
    bio: str
    profile_picture: Optional[AnyHttpUrl] = None
    ratings: Optional[int] = None
    order_time: Optional[str] = None


class VendorUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[AnyHttpUrl] = None
    ratings: Optional[int] = Field(default=None, ge=0, le=5)
    order_time: Optional[str] = None


class TotalSalesReturn(BaseModel):
    total_sales: int
    total_orders: int


class OrdersWithCustomerDetails(OrderItemsReturn):

    order: OrderReturn
