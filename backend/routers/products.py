from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/products", tags=["products"])


class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = 0
    is_active: bool = True
    file_type: Optional[str] = None


class ProductUpdate(ProductCreate):
    pass


@router.get("")
def list_products(is_active: Optional[bool] = None, limit: Optional[int] = None):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT * FROM products WHERE 1=1"
        params = []
        if is_active is not None:
            query += " AND is_active = %s"
            params.append(is_active)
        query += " ORDER BY created_at DESC"
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        cur.execute(query, params)
        return cur.fetchall()


@router.get("/count")
def count_products():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS count FROM products")
        return cur.fetchone()


@router.get("/{product_id}")
def get_product(product_id: str, is_active: Optional[bool] = None):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT * FROM products WHERE id = %s"
        params = [product_id]
        if is_active is not None:
            query += " AND is_active = %s"
            params.append(is_active)
        cur.execute(query, params)
        product = cur.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product


@router.post("", dependencies=[Depends(require_admin)])
def create_product(body: ProductCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO products (title, description, price, image_url, category, stock, is_active, file_type) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *",
            (body.title, body.description, body.price, body.image_url, body.category, body.stock, body.is_active, body.file_type),
        )
        return cur.fetchone()


@router.put("/{product_id}", dependencies=[Depends(require_admin)])
def update_product(product_id: str, body: ProductUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE products SET title=%s, description=%s, price=%s, image_url=%s, category=%s, stock=%s, is_active=%s, file_type=%s WHERE id=%s RETURNING *",
            (body.title, body.description, body.price, body.image_url, body.category, body.stock, body.is_active, body.file_type, product_id),
        )
        product = cur.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product


@router.delete("/{product_id}", dependencies=[Depends(require_admin)])
def delete_product(product_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        return {"success": True}
