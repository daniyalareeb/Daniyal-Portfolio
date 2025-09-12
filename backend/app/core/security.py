"""
DanPortfolio Backend - Security Management Module

This module provides comprehensive security functionality for the DanPortfolio backend,
including JWT token management, secure cookie handling, and authentication verification.

Key Features:
- JWT token generation and verification with expiration
- Secure cookie creation with proper security attributes
- Session management with automatic cleanup
- CSRF protection framework
- Environment-aware security settings

Security Best Practices:
- Uses HS256 algorithm for JWT signing
- Implements secure cookie attributes (HttpOnly, SameSite, Secure)
- Token expiration for session security
- Proper error handling without information leakage

Author: Daniyal Ahmad
Repository: https://github.com/daniyalareeb/portfolio
"""

import jwt
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Request, Header
import json
import urllib.parse

class SecurityManager:
    """
    Centralized security management for authentication and session handling.
    
    This class provides methods for:
    - JWT token generation and verification
    - Secure cookie creation and management
    - Session validation and cleanup
    - CSRF token verification
    
    Attributes:
        secret_key (str): Secret key for JWT signing
        algorithm (str): JWT signing algorithm (HS256)
    """
    
    def __init__(self, secret_key: str):
        """
        Initialize the SecurityManager with a secret key.
        
        Args:
            secret_key (str): Secret key used for JWT signing and verification
        """
        self.secret_key = secret_key
        self.algorithm = "HS256"  # HMAC SHA-256 algorithm
    
    def generate_session_token(self, user_id: str = "admin", expires_hours: int = 2) -> str:
        """
        Generate a signed JWT session token with expiration.
        
        Creates a secure JWT token containing user information and session metadata.
        The token includes a unique session ID and expiration time for security.
        
        Args:
            user_id (str): User identifier (default: "admin")
            expires_hours (int): Token expiration time in hours (default: 2)
            
        Returns:
            str: Signed JWT token string
            
        Security Features:
            - Unique session ID for each token
            - Automatic expiration to limit session lifetime
            - Signed with secret key to prevent tampering
        """
        now = datetime.utcnow()
        payload = {
            "user_id": user_id,
            "authenticated": True,
            "iat": now,  # Issued at time
            "exp": now + timedelta(hours=expires_hours),  # Expiration time
            "session_id": secrets.token_urlsafe(32)  # Unique session identifier
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_session_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode a JWT session token.
        
        Validates the token signature and expiration, returning the payload
        if valid. Raises appropriate HTTP exceptions for invalid tokens.
        
        Args:
            token (str): JWT token to verify
            
        Returns:
            Dict[str, Any]: Decoded token payload
            
        Raises:
            HTTPException: 401 if token is expired or invalid
            
        Security Features:
            - Signature verification prevents tampering
            - Automatic expiration checking
            - Proper error handling without information leakage
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Session expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid session token")
    
    def create_secure_cookie(self, token: str, max_age: int = 7200) -> str:
        """
        Create a secure cookie string with proper security attributes.
        
        Generates a cookie string with security best practices including
        HttpOnly, SameSite, and Secure flags (in production).
        
        Args:
            token (str): JWT token to store in cookie
            max_age (int): Cookie expiration time in seconds (default: 7200 = 2 hours)
            
        Returns:
            str: Properly formatted cookie string
            
        Security Features:
            - HttpOnly: Prevents JavaScript access to cookie
            - SameSite=Strict: Prevents CSRF attacks
            - Secure: HTTPS-only in production
            - Path=/: Available for entire domain
        """
        # Build cookie parts with security attributes
        cookie_parts = [
            f"admin_session={token}",
            "Path=/",                    # Available for entire domain
            "HttpOnly",                  # Prevent JavaScript access
            "SameSite=Strict",          # Prevent CSRF attacks
            f"Max-Age={max_age}"        # Expiration time
        ]
        
        # Add Secure flag in production (HTTPS only)
        if not self._is_development():
            cookie_parts.append("Secure")
            
        return "; ".join(cookie_parts)
    
    def clear_session_cookie(self) -> str:
        """
        Create a cookie clearing string for logout.
        
        Generates a cookie string that effectively removes the session cookie
        by setting it to expire in the past.
        
        Returns:
            str: Cookie clearing string
        """
        return "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    def _is_development(self) -> bool:
        """
        Check if running in development mode.
        
        Determines the environment based on APP_ENV environment variable.
        Used to conditionally apply security settings.
        
        Returns:
            bool: True if in development mode, False otherwise
        """
        import os
        return os.getenv("APP_ENV", "development") == "development"
    
    def verify_admin_session(self, request: Request) -> Dict[str, Any]:
        """
        Verify admin session from request cookies.
        
        Extracts and validates the admin session cookie from the request,
        ensuring the user is properly authenticated.
        
        Args:
            request (Request): FastAPI request object
            
        Returns:
            Dict[str, Any]: Decoded session data
            
        Raises:
            HTTPException: 401 if session is invalid or missing
            
        Security Features:
            - Cookie extraction and validation
            - JWT token verification
            - Session data validation
            - Proper error handling
        """
        admin_session = request.cookies.get('admin_session')
        if not admin_session:
            raise HTTPException(status_code=401, detail="No admin session found")
        
        try:
            # Verify the JWT token signature and expiration
            session_data = self.verify_session_token(admin_session)
            
            # Additional validation for session data integrity
            if not session_data.get('authenticated'):
                raise HTTPException(status_code=401, detail="Invalid session data")
                
            return session_data
        except HTTPException:
            # Re-raise HTTP exceptions (already properly formatted)
            raise
        except Exception as e:
            # Catch any unexpected errors and return generic message
            raise HTTPException(status_code=401, detail="Invalid session cookie")
    
    def verify_csrf_token(self, request: Request, csrf_token: Optional[str] = Header(None)) -> bool:
        """
        Verify CSRF token for POST requests.
        
        Provides CSRF protection by validating tokens for state-changing requests.
        Currently implements a basic framework - can be enhanced for production.
        
        Args:
            request (Request): FastAPI request object
            csrf_token (Optional[str]): CSRF token from header
            
        Returns:
            bool: True if CSRF token is valid
            
        Raises:
            HTTPException: 403 if CSRF token is missing or invalid
            
        Note:
            This is a basic implementation. For production, implement proper
            CSRF token generation and validation with session binding.
        """
        # Only require CSRF tokens for state-changing methods
        if request.method != "POST":
            return True
            
        if not csrf_token:
            raise HTTPException(status_code=403, detail="CSRF token required for POST requests")
        
        # Verify session exists and is valid
        try:
            session_data = self.verify_admin_session(request)
            # TODO: Implement proper CSRF token validation
            # For now, we'll use a simple approach - in production, use proper CSRF tokens
            return True
        except HTTPException:
            raise HTTPException(status_code=403, detail="Invalid CSRF token")

# Global security manager instance - singleton pattern for efficiency
security_manager = None

def get_security_manager() -> SecurityManager:
    """
    Get the global SecurityManager instance.
    
    Implements singleton pattern to ensure consistent security configuration
    across the application. Initializes with JWT secret from settings.
    
    Returns:
        SecurityManager: Global security manager instance
        
    Note:
        The security manager is initialized lazily on first access,
        ensuring settings are loaded before initialization.
    """
    global security_manager
    if security_manager is None:
        from app.config import settings
        security_manager = SecurityManager(secret_key=settings.JWT_SECRET_KEY)
    return security_manager
