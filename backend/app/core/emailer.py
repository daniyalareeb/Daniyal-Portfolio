"""
Email service for sending contact form submissions and notifications.
Uses Gmail SMTP with app passwords for security.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.admin_email = settings.ADMIN_EMAIL

    def send_contact_email(self, name: str, email: str, message: str) -> bool:
        """Send contact form submission email to admin"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = self.admin_email
            msg['Subject'] = f"New Portfolio Contact from {name}"

            # Email body
            body = f"""
            New contact form submission from your portfolio website:
            
            Name: {name}
            Email: {email}
            Message:
            {message}
            
            ---
            This email was sent automatically from your portfolio contact form.
            """

            msg.attach(MIMEText(body, 'plain'))

            # Send email with timeout - handle both TLS and SSL
            if self.smtp_port == 465:
                # Use SSL for port 465
                with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, timeout=10) as server:
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)
            else:
                # Use TLS for port 587
                with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)

            logger.info(f"Contact email sent successfully from {name} <{email}>")
            return True

        except Exception as e:
            logger.error(f"Failed to send contact email: {e}")
            return False

    def send_notification_email(self, subject: str, message: str, to_email: str = None) -> bool:
        """Send general notification email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = to_email or self.admin_email
            msg['Subject'] = subject

            msg.attach(MIMEText(message, 'plain'))

            # Send email with timeout - handle both TLS and SSL
            if self.smtp_port == 465:
                # Use SSL for port 465
                with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, timeout=10) as server:
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)
            else:
                # Use TLS for port 587
                with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)

            logger.info(f"Notification email sent successfully to {msg['To']}")
            return True

        except Exception as e:
            logger.error(f"Failed to send notification email: {e}")
            return False

# Global instance
email_service = EmailService()




