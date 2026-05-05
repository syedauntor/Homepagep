from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/blog-posts", tags=["blog_posts"])


class BlogPostCreate(BaseModel):
    title: str
    content: Optional[str] = None
    excerpt: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    featured_image: Optional[str] = None
    image_alt: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    slug: str
    category_id: Optional[str] = None
    status: str = "draft"
    published_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    lock_modified_date: Optional[bool] = False


class BlogPostUpdate(BlogPostCreate):
    pass


@router.get("")
def list_posts(status: Optional[str] = None, limit: Optional[int] = None, sort: str = "created_at_desc"):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT bp.*, c.name AS category_name, c.slug AS category_slug FROM blog_posts bp LEFT JOIN categories c ON bp.category_id = c.id WHERE 1=1"
        params = []
        if status:
            query += " AND bp.status = %s"
            params.append(status)
            if status == "published":
                query += " AND bp.published_at <= NOW()"
        order = "bp.created_at DESC" if "desc" in sort else "bp.created_at ASC"
        if "views" in sort:
            order = "bp.views DESC"
        query += f" ORDER BY {order}"
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        cur.execute(query, params)
        return cur.fetchall()


@router.get("/count")
def count_posts():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS count FROM blog_posts")
        return cur.fetchone()


@router.get("/{id_or_slug}")
def get_post(id_or_slug: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM blog_posts WHERE slug = %s OR id::text = %s", (id_or_slug, id_or_slug))
        post = cur.fetchone()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post


@router.post("/{post_id}/increment-views")
def increment_views(post_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE blog_posts SET views = COALESCE(views, 0) + 1 WHERE id = %s", (post_id,))
        return {"success": True}


@router.get("/{post_id}/prev")
def prev_post(post_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT created_at FROM blog_posts WHERE id = %s", (post_id,))
        row = cur.fetchone()
        if not row:
            return None
        cur.execute(
            "SELECT * FROM blog_posts WHERE created_at < %s ORDER BY created_at DESC LIMIT 1",
            (row["created_at"],),
        )
        return cur.fetchone()


@router.get("/{post_id}/next")
def next_post(post_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT created_at FROM blog_posts WHERE id = %s", (post_id,))
        row = cur.fetchone()
        if not row:
            return None
        cur.execute(
            "SELECT * FROM blog_posts WHERE created_at > %s ORDER BY created_at ASC LIMIT 1",
            (row["created_at"],),
        )
        return cur.fetchone()


@router.post("", dependencies=[Depends(require_admin)])
def create_post(body: BlogPostCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO blog_posts
               (title, content, excerpt, author, image_url, featured_image, image_alt,
                seo_title, seo_description, seo_keywords, slug, category_id, status,
                published_at, modified_at, lock_modified_date)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
               RETURNING *""",
            (body.title, body.content, body.excerpt, body.author, body.image_url,
             body.featured_image, body.image_alt, body.seo_title, body.seo_description,
             body.seo_keywords, body.slug, body.category_id, body.status,
             body.published_at, body.modified_at, body.lock_modified_date),
        )
        return cur.fetchone()


@router.put("/{post_id}", dependencies=[Depends(require_admin)])
def update_post(post_id: str, body: BlogPostUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            """UPDATE blog_posts SET
               title=%s, content=%s, excerpt=%s, author=%s, image_url=%s, featured_image=%s,
               image_alt=%s, seo_title=%s, seo_description=%s, seo_keywords=%s, slug=%s,
               category_id=%s, status=%s, published_at=%s, modified_at=%s, lock_modified_date=%s
               WHERE id = %s RETURNING *""",
            (body.title, body.content, body.excerpt, body.author, body.image_url,
             body.featured_image, body.image_alt, body.seo_title, body.seo_description,
             body.seo_keywords, body.slug, body.category_id, body.status,
             body.published_at, body.modified_at, body.lock_modified_date, post_id),
        )
        post = cur.fetchone()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post


@router.delete("/{post_id}", dependencies=[Depends(require_admin)])
def delete_post(post_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM blog_posts WHERE id = %s", (post_id,))
        return {"success": True}
