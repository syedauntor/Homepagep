from fastapi import APIRouter, Depends
from pydantic import BaseModel
from database import get_db
from auth import require_admin

router = APIRouter(prefix="/contact", tags=["contact"])


class ContactSubmission(BaseModel):
    name: str
    email: str
    subject: str
    message: str


@router.post("")
def submit_contact(body: ContactSubmission):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO contact_submissions (name, email, subject, message) VALUES (%s,%s,%s,%s) RETURNING *",
            (body.name, body.email, body.subject, body.message),
        )
        return cur.fetchone()


@router.get("", dependencies=[Depends(require_admin)])
def list_submissions():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC")
        return cur.fetchall()


@router.get("/count", dependencies=[Depends(require_admin)])
def count_submissions():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS count FROM contact_submissions")
        return cur.fetchone()


@router.delete("/{submission_id}", dependencies=[Depends(require_admin)])
def delete_submission(submission_id: str):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM contact_submissions WHERE id = %s", (submission_id,))
        return {"success": True}
