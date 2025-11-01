"""
DanPortfolio Backend - Authentication API Module

This module provides authentication endpoints for the admin interface,
including login, logout, and session management functionality.

Key Features:
- Secure password-based authentication
- JWT session token generation and management
- Secure cookie handling with proper security attributes
- Session extension for active users
- Proper error handling and security practices

Security Features:
- Password verification against secure storage
- JWT tokens with expiration
- HttpOnly cookies to prevent XSS
- SameSite=Strict to prevent CSRF
- Secure flag in production

Author: Daniyal Ahmad
Repository: https://github.com/daniyalareeb/portfolio
"""

from fastapi import APIRouter, HTTPException, Request, Response
from app.config import settings
from app.core.security import get_security_manager
from pydantic import BaseModel

# Create router for authentication endpoints
router = APIRouter()

class LoginRequest(BaseModel):
    """
    Request model for admin login.
    
    Attributes:
        password (str): Admin password for authentication
    """
    password: str

@router.post("/login")
async def admin_login(request: LoginRequest, response: Response):
    """
    Admin login endpoint with secure session creation.
    
    Authenticates the admin user and creates a secure JWT session.
    Sets an HttpOnly cookie with the session token for subsequent requests.
    
    Args:
        request (LoginRequest): Login request containing password
        response (Response): FastAPI response object for setting cookies
        
    Returns:
        dict: Success message and status
        
    Raises:
        HTTPException: 401 if password is invalid
        
    Security Features:
        - Password verification against stored credentials
        - JWT token generation with expiration
        - Secure cookie setting with HttpOnly flag
        - Session ID generation for tracking
    """
    # Verify password against stored credentials
    # Debug: Log password comparison (remove in production)
    admin_pass = os.environ.get('ADMIN_PASSWORD', settings.ADMIN_PASSWORD)
    if request.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Create secure JWT session token
    security_manager = get_security_manager()
    session_token = security_manager.generate_session_token()
    
    # Set secure cookie in response headers
    cookie_string = security_manager.create_secure_cookie(session_token)
    response.headers["Set-Cookie"] = cookie_string
    
    return {"success": True, "message": "Login successful"}

@router.post("/logout")
async def admin_logout(response: Response):
    """
    Admin logout endpoint with session cleanup.
    
    Clears the admin session cookie, effectively logging out the user.
    The cookie is set to expire immediately to ensure proper cleanup.
    
    Args:
        response (Response): FastAPI response object for clearing cookies
        
    Returns:
        dict: Success message and status
        
    Security Features:
        - Immediate cookie expiration
        - Proper cookie clearing with all security attributes
        - No sensitive data exposure
    """
    security_manager = get_security_manager()
    cookie_string = security_manager.clear_session_cookie()
    response.headers["Set-Cookie"] = cookie_string
    
    return {"success": True, "message": "Logout successful"}

@router.post("/extend-session")
async def extend_session(request: Request, response: Response):
    """
    Extend admin session endpoint.
    
    Validates the current session and creates a new session token
    with extended expiration time. Useful for active users to maintain
    their session without re-authentication.
    
    Args:
        request (Request): FastAPI request object containing session cookie
        response (Response): FastAPI response object for setting new cookie
        
    Returns:
        dict: Success message and status
        
    Raises:
        HTTPException: 401 if current session is invalid
        
    Security Features:
        - Current session validation before extension
        - New token generation with fresh expiration
        - Secure cookie replacement
        - Proper error handling for invalid sessions
    """
    security_manager = get_security_manager()
    
    try:
        # Verify current session is valid
        session_data = security_manager.verify_admin_session(request)
        
        # Generate new session token with extended expiration
        new_token = security_manager.generate_session_token()
        cookie_string = security_manager.create_secure_cookie(new_token)
        response.headers["Set-Cookie"] = cookie_string
        
        return {"success": True, "message": "Session extended successfully"}
    except HTTPException:
        # Re-raise HTTP exceptions (already properly formatted)
        raise
    except Exception as e:
        # Handle unexpected errors gracefully
        raise HTTPException(status_code=401, detail="Failed to extend session")
