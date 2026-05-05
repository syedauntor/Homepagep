from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/pages", tags=["pages"])


class PageCreate(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    is_published: bool = False


class PageUpdate(PageCreate):
    pass


@router.get("")
def list_pages(is_published: Optional[bool] = None):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT * FROM pages WHERE 1=1"
        params = []
        if is_published is not None:
            query += " AND is_published = %s"
            params.append(is_published)
        query += " ORDER BY created_at ASC"
        cur.execute(query, params)
        return cur.fetchall()


@router.get("/{slug}")
def get_page(slug: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM pages WHERE slug = %s AND is_published = true", (slug,))
        page = cur.fetchone()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return page


@router.post("", dependencies=[Depends(require_admin)])
def create_page(body: PageCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO pages (title, slug, content, seo_title, seo_description, seo_keywords, is_published, is_system) VALUES (%s,%s,%s,%s,%s,%s,%s,false) RETURNING *",
            (body.title, body.slug, body.content, body.seo_title, body.seo_description, body.seo_keywords, body.is_published),
        )
        return cur.fetchone()


@router.put("/{page_id}", dependencies=[Depends(require_admin)])
def update_page(page_id: str, body: PageUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE pages SET title=%s, slug=%s, content=%s, seo_title=%s, seo_description=%s, seo_keywords=%s, is_published=%s, updated_at=%s WHERE id=%s RETURNING *",
            (body.title, body.slug, body.content, body.seo_title, body.seo_description, body.seo_keywords, body.is_published, datetime.utcnow(), page_id),
        )
        page = cur.fetchone()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return page


@router.patch("/{page_id}/toggle-published", dependencies=[Depends(require_admin)])
def toggle_published(page_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE pages SET is_published = NOT is_published WHERE id=%s RETURNING *", (page_id,))
        page = cur.fetchone()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return page


@router.delete("/{page_id}", dependencies=[Depends(require_admin)])
def delete_page(page_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM pages WHERE id = %s AND is_system = false", (page_id,))
        return {"success": True}
