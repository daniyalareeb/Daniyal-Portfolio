"""
Send contact emails via the emailer service.
"""
from app.core.emailer import email_service

def send_contact_email(name: str, email: str, message: str):
    """Send contact form email using the emailer service"""
    return email_service.send_contact_email(name, email, message)
