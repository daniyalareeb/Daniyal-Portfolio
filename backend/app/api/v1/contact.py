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
    # Use Resend API for email delivery - no database storage
    email_sent = False
    try:
        from app.config import settings
        
        # Resend API configuration
        resend_api_key = settings.RESEND_API_KEY
        resend_url = "https://api.resend.com/emails"
        
        email_data = {
            "from": f"Portfolio Contact <{settings.RESEND_FROM_EMAIL}>",
            "to": [settings.ADMIN_EMAIL],
            "subject": f"New Contact from {payload.name}",
            "html": f"""
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {payload.name}</p>
            <p><strong>Email:</strong> {payload.email}</p>
            <p><strong>Message:</strong></p>
            <p>{payload.message}</p>
            <hr>
            <p><em>This email was sent from your portfolio contact form.</em></p>
            """,
            "reply_to": payload.email
        }
        
        headers = {
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        }
        
        with httpx.Client(timeout=10.0) as client:
            response = client.post(resend_url, json=email_data, headers=headers)
            if response.status_code == 200:
                email_sent = True
                print(f"Contact email sent via Resend from {payload.name}")
            else:
                print(f"Resend failed: {response.status_code} - {response.text}")
                
    except Exception as e:
        print(f"Resend email sending failed: {e}")
        email_sent = False

    # Return success regardless of email status for better UX
    return APIResponse(success=True, data={"message": "Thanks! I'll get back to you soon.", "email_sent": email_sent})
