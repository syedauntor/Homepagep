from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/menu", tags=["menu"])


class MenuItemCreate(BaseModel):
    menu_location: str
    label: str
    url: str
    target: str = "_self"
    display_order: int = 0
    parent_id: Optional[str] = None
    is_active: bool = True


class MenuItemUpdate(BaseModel):
    label: str
    url: str
    target: str
    display_order: int
    is_active: bool


@router.get("")
def list_menu_items(location: Optional[str] = None, is_active: Optional[bool] = None):
    with get_db() as conn:
        cur = conn.cursor()
        query = "SELECT * FROM menu_items WHERE 1=1"
        params = []
        if location:
            query += " AND menu_location = %s"
            params.append(location)
        if is_active is not None:
            query += " AND is_active = %s"
            params.append(is_active)
        query += " ORDER BY display_order"
        cur.execute(query, params)
        return cur.fetchall()


@router.post("", dependencies=[Depends(require_admin)])
def create_menu_item(body: MenuItemCreate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO menu_items (menu_location, label, url, target, display_order, parent_id, is_active) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *",
            (body.menu_location, body.label, body.url, body.target, body.display_order, body.parent_id, body.is_active),
        )
        return cur.fetchone()


@router.put("/{item_id}", dependencies=[Depends(require_admin)])
def update_menu_item(item_id: str, body: MenuItemUpdate):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "UPDATE menu_items SET label=%s, url=%s, target=%s, display_order=%s, is_active=%s WHERE id=%s RETURNING *",
            (body.label, body.url, body.target, body.display_order, body.is_active, item_id),
        )
        item = cur.fetchone()
        if not item:
            raise HTTPException(status_code=404, detail="Menu item not found")
        return item


@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_menu_item(item_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM menu_items WHERE id = %s", (item_id,))
        return {"success": True}
