from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    customer_email: str
    customer_name: str
    total_amount: float
    items: List[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str


@router.get("", dependencies=[Depends(require_admin)])
def list_orders():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        return cur.fetchall()


@router.get("/stats", dependencies=[Depends(require_admin)])
def order_stats():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = cur.fetchall()
        total_revenue = sum(float(o["total_amount"]) for o in orders)
        recent = [o for o in orders if o["created_at"]][:5]
        return {"orders": orders, "total_revenue": total_revenue, "recent": recent}


@router.get("/{order_id}")
def get_order(order_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        order = cur.fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        cur.execute(
            "SELECT oi.*, p.title AS product_title, p.image_url AS product_image, p.file_type FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = %s",
            (order_id,),
        )
        items = cur.fetchall()
        return {"order": order, "items": items}


@router.post("")
def create_order(body: OrderCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO orders (customer_email, customer_name, total_amount, status) VALUES (%s,%s,%s,'pending') RETURNING *",
            (body.customer_email, body.customer_name, body.total_amount),
        )
        order = cur.fetchone()
        for item in body.items:
            cur.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s,%s,%s,%s)",
                (order["id"], item.product_id, item.quantity, item.price),
            )
        return order


@router.patch("/{order_id}/status", dependencies=[Depends(require_admin)])
def update_order_status(order_id: str, body: OrderStatusUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status=%s WHERE id=%s RETURNING *", (body.status, order_id))
        order = cur.fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
