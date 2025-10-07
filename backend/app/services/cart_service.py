from sqlalchemy.orm import Session
from app.crud.cart import (
    create_cart_item, update_cart_item, delete_cart_item, clear_cart,
    get_cart_items, create_order, create_order_item, get_order_by_payment_ref,
    update_order_status
)
from app.schemas.cart import CartCreate, CartUpdate, CartReturn, CartUpdateReturn, CartSummary, CartItem, CheckoutCreate, PaymentVerified
from app.models.deal import Deal
from typing import List
import uuid

class CartService:
    def __init__(self, db: Session):
        self.db = db

    async def create_cart(self, data_obj: CartCreate, customer_id: int) -> CartReturn:
        cart_item = create_cart_item(self.db, data_obj, customer_id)
        return CartReturn.from_orm(cart_item)

    async def update_cart(self, data_obj: CartUpdate, customer_id: int) -> CartUpdateReturn:
        cart_item = update_cart_item(self.db, data_obj, customer_id)
        if cart_item:
            return CartUpdateReturn.from_orm(cart_item)
        return None

    async def delete_cart_item(self, product_id: int, customer_id: int):
        return delete_cart_item(self.db, product_id, customer_id)

    async def clear_cart(self, customer_id: int):
        return clear_cart(self.db, customer_id)

    async def get_cart_summary(self, customer_id: int) -> CartSummary:
        cart_items = get_cart_items(self.db, customer_id)
        
        items = []
        total_amount = 0.0
        total_items = 0
        
        for cart_item in cart_items:
            # Get product details
            product = self.db.query(Deal).filter(Deal.id == cart_item.product_id).first()
            if product:
                item_total = product.price * cart_item.quantity
                items.append(CartItem(
                    product_id=cart_item.product_id,
                    title=product.title,
                    price=product.price,
                    quantity=cart_item.quantity,
                    total=item_total
                ))
                total_amount += item_total
                total_items += cart_item.quantity
        
        return CartSummary(
            items=items,
            total_items=total_items,
            total_amount=total_amount
        )

    async def checkout(self, data_obj: CheckoutCreate, current_user):
        # Get cart items
        cart_items = get_cart_items(self.db, current_user.role_id)
        
        if not cart_items:
            raise ValueError("Cart is empty")
        
        # Calculate total
        total_amount = 0.0
        for cart_item in cart_items:
            product = self.db.query(Deal).filter(Deal.id == cart_item.product_id).first()
            if product:
                total_amount += product.price * cart_item.quantity
        
        # Generate payment reference
        payment_ref = str(uuid.uuid4())
        
        # Create order
        order = create_order(self.db, current_user.role_id, payment_ref, total_amount)
        
        # Create order items
        for cart_item in cart_items:
            product = self.db.query(Deal).filter(Deal.id == cart_item.product_id).first()
            if product:
                create_order_item(self.db, order.id, cart_item.product_id, cart_item.quantity, product.price)
        
        # Clear cart
        clear_cart(self.db, current_user.role_id)
        
        return {
            "order_id": order.id,
            "payment_ref": payment_ref,
            "total_amount": total_amount,
            "status": "pending"
        }

    async def verify_order_payment(self, payment_ref: str) -> PaymentVerified:
        order = get_order_by_payment_ref(self.db, payment_ref)
        
        if not order:
            raise ValueError("Order not found")
        
        # Update order status to paid
        updated_order = update_order_status(self.db, order.id, "paid")
        
        return PaymentVerified(
            payment_ref=payment_ref,
            status=updated_order.status,
            amount=updated_order.total_amount,
            order_id=updated_order.id
        )
