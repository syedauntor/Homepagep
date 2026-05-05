from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/categories", tags=["categories"])


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    position: Optional[int] = 0


class CategoryUpdate(CategoryCreate):
    pass


@router.get("")
def list_categories():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM categories ORDER BY position, name")
        return cur.fetchall()


@router.get("/{id_or_slug}")
def get_category(id_or_slug: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM categories WHERE slug = %s OR id::text = %s", (id_or_slug, id_or_slug))
        cat = cur.fetchone()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        return cat


@router.get("/{category_id}/posts")
def posts_by_category(category_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            """SELECT bp.* FROM blog_posts bp
               WHERE bp.category_id = %s AND bp.status = 'published' AND bp.published_at <= NOW()
               ORDER BY bp.created_at DESC""",
            (category_id,),
        )
        return cur.fetchall()


@router.post("", dependencies=[Depends(require_admin)])
def create_category(body: CategoryCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO categories (name, slug, description, parent_id, position) VALUES (%s,%s,%s,%s,%s) RETURNING *",
            (body.name, body.slug, body.description, body.parent_id, body.position),
        )
        return cur.fetchone()


@router.put("/{category_id}", dependencies=[Depends(require_admin)])
def update_category(category_id: str, body: CategoryUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE categories SET name=%s, slug=%s, description=%s, parent_id=%s, position=%s WHERE id=%s RETURNING *",
            (body.name, body.slug, body.description, body.parent_id, body.position, category_id),
        )
        cat = cur.fetchone()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        return cat


@router.delete("/{category_id}", dependencies=[Depends(require_admin)])
def delete_category(category_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM categories WHERE id = %s", (category_id,))
        return {"success": True}
