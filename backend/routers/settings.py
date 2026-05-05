from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingUpdate(BaseModel):
    value: str


@router.get("")
def list_settings():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM site_settings ORDER BY \"group\", key")
        return cur.fetchall()


@router.get("/{key}")
def get_setting(key: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM site_settings WHERE key = %s", (key,))
        return cur.fetchone()


@router.put("/{key}", dependencies=[Depends(require_admin)])
def update_setting(key: str, body: SettingUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE site_settings SET value=%s, updated_at=%s WHERE key=%s RETURNING *",
            (body.value, datetime.utcnow(), key),
        )
        return cur.fetchone()
