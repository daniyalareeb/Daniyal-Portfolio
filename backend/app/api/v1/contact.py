import uuid
import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.contact import ContactIn
from app.models.contact import ContactSubmission

router = APIRouter()

@router.post("/contact/submit", response_model=APIResponse)
def contact_submit(payload: ContactIn, db: Session = Depends(get_db)):
    # Use Resend API for email delivery - no database storage
    admin_email_sent = False
    confirmation_email_sent = False
    
    try:
        from app.config import settings
        
        # Resend API configuration
        resend_api_key = settings.RESEND_API_KEY
        resend_url = "https://api.resend.com/emails"
        
        headers = {
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        }
        
        with httpx.Client(timeout=10.0) as client:
            # 1. Send notification email to admin
            admin_email_data = {
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
            
            admin_response = client.post(resend_url, json=admin_email_data, headers=headers)
            if admin_response.status_code == 200:
                admin_email_sent = True
                print(f"Admin notification email sent via Resend from {payload.name}")
            else:
                print(f"Admin email failed: {admin_response.status_code} - {admin_response.text}")
            
            # 2. Send confirmation email to user
            confirmation_email_data = {
                "from": f"Daniyal Ahmad <{settings.RESEND_FROM_EMAIL}>",
                "to": [payload.email],
                "subject": "Thank you for contacting me!",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                        Thank You for Contacting Me!
                    </h2>
                    
                    <p>Hi {payload.name},</p>
                    
                    <p>Thank you for reaching out through my portfolio website! I've received your message and will get back to you as soon as possible.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                        <p><strong>Your Message:</strong></p>
                        <p style="font-style: italic;">"{payload.message}"</p>
                    </div>
                    
                    <p>I typically respond within 24-48 hours. If you have any urgent inquiries, feel free to reach out directly.</p>
                    
                    <p>Best regards,<br>
                    <strong>Daniyal Ahmad</strong><br>
                    <em>Full Stack Developer</em></p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    
                    <p style="font-size: 12px; color: #666;">
                        This is an automated confirmation email. Please do not reply to this message.
                        <br>Visit my portfolio: <a href="https://daniyalareeb.com" style="color: #007bff;">daniyalareeb.com</a>
                    </p>
                </div>
                """
            }
            
            confirmation_response = client.post(resend_url, json=confirmation_email_data, headers=headers)
            if confirmation_response.status_code == 200:
                confirmation_email_sent = True
                print(f"Confirmation email sent to {payload.email}")
            else:
                print(f"Confirmation email failed: {confirmation_response.status_code} - {confirmation_response.text}")
                
    except Exception as e:
        print(f"Email sending failed: {e}")
        admin_email_sent = False
        confirmation_email_sent = False

    # Return success regardless of email status for better UX
    return APIResponse(
        success=True, 
        data={
            "message": "Thanks! I'll get back to you soon. Check your email for a confirmation.", 
            "admin_email_sent": admin_email_sent,
            "confirmation_email_sent": confirmation_email_sent
        }
    )
