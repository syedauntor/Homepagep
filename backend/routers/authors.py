from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/authors", tags=["authors"])


class AuthorCreate(BaseModel):
    name: str
    designation: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    avatar_alt: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = "author"
    access_enabled: bool = False
    fb_url: Optional[str] = None
    ig_url: Optional[str] = None
    x_url: Optional[str] = None
    pinterest_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    show_on_home: bool = False
    display_order: int = 0
    is_active: bool = True


class AuthorUpdate(AuthorCreate):
    pass


@router.get("")
def list_authors(show_on_home: Optional[bool] = None, is_active: Optional[bool] = None):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT * FROM authors WHERE 1=1"
        params = []
        if show_on_home is not None:
            query += " AND show_on_home = %s"
            params.append(show_on_home)
        if is_active is not None:
            query += " AND is_active = %s"
            params.append(is_active)
        query += " ORDER BY display_order, created_at"
        cur.execute(query, params)
        return cur.fetchall()


@router.get("/by-name/{name}")
def get_author_by_name(name: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "SELECT name, designation, bio, avatar_url, fb_url, ig_url, x_url, linkedin_url, pinterest_url FROM authors WHERE LOWER(name) = LOWER(%s) AND is_active = true",
            (name,),
        )
        author = cur.fetchone()
        if not author:
            raise HTTPException(status_code=404, detail="Author not found")
        return author


@router.post("", dependencies=[Depends(require_admin)])
def create_author(body: AuthorCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO authors (name, designation, bio, avatar_url, avatar_alt, email, role,
               access_enabled, fb_url, ig_url, x_url, pinterest_url, linkedin_url,
               show_on_home, display_order, is_active)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""",
            (body.name, body.designation, body.bio, body.avatar_url, body.avatar_alt,
             body.email, body.role, body.access_enabled, body.fb_url, body.ig_url,
             body.x_url, body.pinterest_url, body.linkedin_url, body.show_on_home,
             body.display_order, body.is_active),
        )
        return cur.fetchone()


@router.put("/{author_id}", dependencies=[Depends(require_admin)])
def update_author(author_id: str, body: AuthorUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            """UPDATE authors SET name=%s, designation=%s, bio=%s, avatar_url=%s, avatar_alt=%s,
               email=%s, role=%s, access_enabled=%s, fb_url=%s, ig_url=%s, x_url=%s,
               pinterest_url=%s, linkedin_url=%s, show_on_home=%s, display_order=%s, is_active=%s, updated_at=%s
               WHERE id=%s RETURNING *""",
            (body.name, body.designation, body.bio, body.avatar_url, body.avatar_alt,
             body.email, body.role, body.access_enabled, body.fb_url, body.ig_url,
             body.x_url, body.pinterest_url, body.linkedin_url, body.show_on_home,
             body.display_order, body.is_active, datetime.utcnow(), author_id),
        )
        author = cur.fetchone()
        if not author:
            raise HTTPException(status_code=404, detail="Author not found")
        return author


@router.patch("/{author_id}/toggle-active", dependencies=[Depends(require_admin)])
def toggle_active(author_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE authors SET is_active = NOT is_active WHERE id=%s RETURNING *", (author_id,))
        author = cur.fetchone()
        if not author:
            raise HTTPException(status_code=404, detail="Author not found")
        return author


@router.delete("/{author_id}", dependencies=[Depends(require_admin)])
def delete_author(author_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM authors WHERE id = %s", (author_id,))
        return {"success": True}
