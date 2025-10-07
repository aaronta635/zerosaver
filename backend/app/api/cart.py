from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.utils.services import get_cart_service
from app.schemas.cart import (
    CartCreate,
    CartReturn,
    CartUpdate,
    CartUpdateReturn,
    CartSummary,
    CheckoutCreate,
    PaymentVerified,
)
from app.services.cart_service import CartService
from app.models.user import User
from app.models.cart import Cart, Order, OrderItem
from app.models.deal import Deal
from datetime import datetime


router = APIRouter(tags=["Cart"])


@router.post("/add", status_code=status.HTTP_201_CREATED, response_model=CartReturn)
async def create_cart(
    data_obj: CartCreate,
    cart_service: CartService = Depends(get_cart_service),
    customer_id: int = 1,  # Simplified for now
):
    return await cart_service.create_cart(
        data_obj=data_obj, customer_id=customer_id
    )


@router.put("/", response_model=CartUpdateReturn)
async def update_cart(
    data_obj: CartUpdate,
    cart_service: CartService = Depends(get_cart_service),
    customer_id: int = 1,  # Simplified for now
):
    return await cart_service.update_cart(
        data_obj=data_obj, customer_id=customer_id
    )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cart_item(
    product_id: int,
    cart_service: CartService = Depends(get_cart_service),
    customer_id: int = 1,  # Simplified for now
):
    return await cart_service.delete_cart_item(
        product_id=product_id, customer_id=customer_id
    )


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    cart_service: CartService = Depends(get_cart_service),
    customer_id: int = 1,  # Simplified for now
):
    await cart_service.clear_cart(customer_id=customer_id)


@router.get("/summary", response_model=CartSummary)
async def get_cart_summary(
    cart_service: CartService = Depends(get_cart_service),
    customer_id: int = 1,  # Simplified for now
):
    return await cart_service.get_cart_summary(customer_id=customer_id)


@router.post("/checkout")
async def checkout_cart(
    customer_id: int = 1,
    db: Session = Depends(get_db)
):
    #1 Get Cart Items

    cart_items = db.query(Cart).filter(Cart.customer_id == customer_id).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    for cart_item in cart_items:
        deal = db.query(Deal).filter(Deal.id == cart_item.product_id).first()

        if deal.quantity < cart_item.quantity:
            raise HTTPException(status_code=400, detail="Insufficent items")

        total_amount += deal.price * cart_item.quantity

    try: 
        order = Order(
            customer_id=customer_id,
            payment_ref=f"pay_{customer_id}_{int(datetime.utcnow().timestamp())}",  # Generate unique payment ref
            total_amount=total_amount,
            status='pending',
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(order)
        db.flush()

        for cart_item in cart_items:
            deal = db.query(Deal).filter(Deal.id == cart_item.product_id).first()

            order_item = OrderItem(
                order_id=order.id,
                product_id=deal.id,  # Changed from deal_id to product_id
                quantity=cart_item.quantity,
                price=deal.price
            )
            db.add(order_item)

            deal.quantity -= cart_item.quantity
            if deal.quantity <= 0:
                deal.is_active = False

        db.query(Cart).filter(Cart.customer_id == customer_id).delete()

        db.commit()
        return {"message": "Order created!"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Order creation failed")


@router.get("/verify-payment/{payment_ref}", response_model=PaymentVerified)
async def verify_order_payment(
    payment_ref: str,
    cart_service: CartService = Depends(get_cart_service),
):
    return await cart_service.verify_order_payment(payment_ref=payment_ref)