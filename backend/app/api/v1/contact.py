import uuid
import httpx
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
    # Try webhook-based email service (Formspree) - no database storage
    email_sent = False
    try:
        # Use Formspree webhook for email delivery
        formspree_url = "https://formspree.io/f/xpwgqkqv"  # Replace with your Formspree endpoint
        
        form_data = {
            "name": payload.name,
            "email": payload.email,
            "message": payload.message,
            "_subject": f"New Contact from {payload.name}",
            "_replyto": payload.email
        }
        
        with httpx.Client(timeout=10.0) as client:
            response = client.post(formspree_url, data=form_data)
            if response.status_code == 200:
                email_sent = True
                print(f"Contact email sent via Formspree from {payload.name}")
            else:
                print(f"Formspree failed: {response.status_code}")
                
    except Exception as e:
        print(f"Webhook email sending failed: {e}")
        email_sent = False

    # Return success regardless of email status for better UX
    return APIResponse(success=True, data={"message": "Thanks! I'll get back to you soon.", "email_sent": email_sent})
