from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=2000)


@router.post("")
def submit_contact_form(data: ContactForm):
    """
    Contact form endpoint.
    For MVP, this just validates the data and returns success.
    No actual email/database storage is performed.
    """
    if not data.name or not data.email or not data.message:
        raise HTTPException(status_code=400, detail="All fields are required")

    return {
        "status": "success",
        "message": "Message sent successfully",
    }
