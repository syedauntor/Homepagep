import os
import uuid
import base64
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import require_admin
from config import settings

router = APIRouter(prefix="/images", tags=["images"])


class ImageCreate(BaseModel):
    filename: str
    storage_path: str
    public_url: str
    size: int
    mime_type: Optional[str] = None


@router.get("", dependencies=[Depends(require_admin)])
def list_images():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM images ORDER BY created_at DESC")
        return cur.fetchall()


@router.post("", dependencies=[Depends(require_admin)])
def save_image(body: ImageCreate):
    """Save image record. The public_url can be a data URL (base64) or a served file URL."""
    # If it's a base64 data URL, save to disk and replace with a file URL
    if body.public_url.startswith("data:"):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        try:
            header, encoded = body.public_url.split(",", 1)
            ext = body.filename.rsplit(".", 1)[-1] if "." in body.filename else "bin"
            saved_name = f"{uuid.uuid4().hex}.{ext}"
            file_path = os.path.join(settings.UPLOAD_DIR, saved_name)
            with open(file_path, "wb") as f:
                f.write(base64.b64decode(encoded))
            public_url = f"/uploads/{saved_name}"
        except Exception:
            public_url = body.public_url
    else:
        public_url = body.public_url

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO images (filename, storage_path, public_url, size, mime_type) VALUES (%s,%s,%s,%s,%s) RETURNING *",
            (body.filename, body.storage_path, public_url, body.size, body.mime_type),
        )
        return cur.fetchone()


@router.delete("/{image_id}", dependencies=[Depends(require_admin)])
def delete_image(image_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT public_url FROM images WHERE id = %s", (image_id,))
        img = cur.fetchone()
        if img and img["public_url"].startswith("/uploads/"):
            file_path = os.path.join(settings.UPLOAD_DIR, img["public_url"].replace("/uploads/", ""))
            if os.path.exists(file_path):
                os.remove(file_path)
        cur.execute("DELETE FROM images WHERE id = %s", (image_id,))
        return {"success": True}
