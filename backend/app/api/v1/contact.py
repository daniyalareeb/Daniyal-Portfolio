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
        # Only try to send email if SMTP credentials are properly configured
        from app.config import settings
        if (settings.SMTP_USER != "your-email@gmail.com" and 
            settings.SMTP_PASSWORD != "your-app-password"):
            send_contact_email(payload.name, payload.email, payload.message)
            print(f"Contact email sent successfully from {payload.name}")
        else:
            print("SMTP credentials not configured, skipping email send")
    except Exception as e:
        # still return success for UX; log later
        print(f"Email sending failed (but contact saved): {e}")
        pass

    return APIResponse(success=True, data={"message": "Thanks! I'll get back to you soon.", "submission_id": sub.id})
