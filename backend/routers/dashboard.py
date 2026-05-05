from fastapi import APIRouter, Depends
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", dependencies=[Depends(require_admin)])
def get_stats():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS count FROM blog_posts")
        blog_count = cur.fetchone()["count"]
        cur.execute("SELECT COUNT(*) AS count FROM products")
        product_count = cur.fetchone()["count"]
        cur.execute("SELECT COUNT(*) AS count FROM contact_submissions")
        message_count = cur.fetchone()["count"]
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = cur.fetchall()
        total_revenue = sum(float(o["total_amount"]) for o in orders)
        recent_orders = list(orders[:5])
        return {
            "blog_count": blog_count,
            "product_count": product_count,
            "message_count": message_count,
            "order_count": len(orders),
            "total_revenue": total_revenue,
            "recent_orders": recent_orders,
        }
