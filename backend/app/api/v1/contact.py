import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.contact import ContactIn
from app.models.contact import ContactSubmission
from app.services.contact_service import send_contact_email

router = APIRouter()

@router.post("/contact/submit", response_model=APIResponse)
def contact_submit(payload: ContactIn, db: Session = Depends(get_db)):
    # Simple auto-increment ID
    next_id = len(db.query(ContactSubmission).all()) + 1
    
    sub = ContactSubmission(
        id=next_id,
        name=payload.name,
        email=payload.email,
        message=payload.message,
    )
    db.add(sub)
    db.commit()

    # send email (won't crash if SMTP fails would be ideal; keep simple)
    try:
        send_contact_email(payload.name, payload.email, payload.message)
    except Exception as e:
        # still return success for UX; log later
        pass

    return APIResponse(success=True, data={"message": "Thanks! I'll get back to you soon.", "submission_id": sub.id})
