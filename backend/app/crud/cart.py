from sqlalchemy.orm import Session
from app.models.cart import Cart, Order, OrderItem
from app.schemas.cart import CartCreate, CartUpdate
from typing import List, Optional
from datetime import datetime

def create_cart_item(db: Session, cart_data: CartCreate, customer_id: int):
    # Check if item already exists in cart
    existing_cart = db.query(Cart).filter(
        Cart.customer_id == customer_id,
        Cart.product_id == cart_data.product_id
    ).first()
    
    if existing_cart:
        # Update quantity
        existing_cart.quantity += cart_data.quantity
        existing_cart.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_cart)
        return existing_cart
    else:
        # Create new cart item
        db_cart = Cart(
            customer_id=customer_id,
            product_id=cart_data.product_id,
            quantity=cart_data.quantity,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_cart)
        db.commit()
        db.refresh(db_cart)
        return db_cart

def update_cart_item(db: Session, cart_data: CartUpdate, customer_id: int):
    cart_item = db.query(Cart).filter(
        Cart.customer_id == customer_id,
        Cart.product_id == cart_data.product_id
    ).first()
    
    if cart_item:
        cart_item.quantity = cart_data.quantity
        cart_item.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(cart_item)
        return cart_item
    return None

def delete_cart_item(db: Session, product_id: int, customer_id: int):
    cart_item = db.query(Cart).filter(
        Cart.customer_id == customer_id,
        Cart.product_id == product_id
    ).first()
    
    if cart_item:
        db.delete(cart_item)
        db.commit()
        return True
    return False

def clear_cart(db: Session, customer_id: int):
    db.query(Cart).filter(Cart.customer_id == customer_id).delete()
    db.commit()
    return True

def get_cart_items(db: Session, customer_id: int) -> List[Cart]:
    return db.query(Cart).filter(Cart.customer_id == customer_id).all()

def create_order(db: Session, customer_id: int, payment_ref: str, total_amount: float):
    db_order = Order(
        customer_id=customer_id,
        payment_ref=payment_ref,
        total_amount=total_amount,
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def create_order_item(db: Session, order_id: int, product_id: int, quantity: int, price: float):
    db_order_item = OrderItem(
        order_id=order_id,
        product_id=product_id,
        quantity=quantity,
        price=price
    )
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item

def get_order_by_payment_ref(db: Session, payment_ref: str) -> Optional[Order]:
    return db.query(Order).filter(Order.payment_ref == payment_ref).first()

def update_order_status(db: Session, order_id: int, status: str):
    order = db.query(Order).filter(Order.id == order_id).first()
    if order:
        order.status = status
        order.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(order)
        return order
    return None
