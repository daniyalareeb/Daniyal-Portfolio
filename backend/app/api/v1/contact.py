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
    # Try to send email directly - no database storage
    email_sent = False
    try:
        # Only try to send email if SMTP credentials are properly configured
        from app.config import settings
        if (settings.SMTP_USER != "your-email@gmail.com" and 
            settings.SMTP_PASSWORD != "your-app-password"):
            email_sent = send_contact_email(payload.name, payload.email, payload.message)
            if email_sent:
                print(f"Contact email sent successfully from {payload.name}")
            else:
                print(f"Failed to send email from {payload.name}")
        else:
            print("SMTP credentials not configured, skipping email send")
    except Exception as e:
        print(f"Email sending failed: {e}")
        email_sent = False

    # Return success regardless of email status for better UX
    return APIResponse(success=True, data={"message": "Thanks! I'll get back to you soon.", "email_sent": email_sent})
