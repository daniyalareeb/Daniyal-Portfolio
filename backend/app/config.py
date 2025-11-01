from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, Field
from typing import List, Union
import os
import json

class Settings(BaseSettings):
    # Configure Pydantic Settings to properly read environment variables
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,  # Environment variable names are case-sensitive
        extra="ignore"  # Ignore extra env vars not defined in the model
    )
    # Server Config
    APP_NAME: str = "Daniyal Portfolio Backend"
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    
    # Database - PostgreSQL for reliable persistence
    DATABASE_URL: str = os.environ.get('DATABASE_URL', 'sqlite:///./data/portfolio.db')
    
    # ChromaDB (external service)
    CHROMADB_URL: str = "http://localhost:8001"
    
    # OpenRouter API (with default for deployment)
    OPENROUTER_API_KEY: str = "your-api-key-here"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "deepseek/deepseek-chat-v3-0324:free"
    
    # Admin Secret - MUST be changed in production
    # Pydantic BaseSettings will automatically read from environment variables
    # Set ADMIN_SECRET in Heroku Config Vars to override
    ADMIN_SECRET: str = "super-secret-string-change-me"
    # Set ADMIN_PASSWORD in Heroku Config Vars (e.g., "SecureAdmin2024")
    ADMIN_PASSWORD: str = "daniyal-admin-2024"
    # Set JWT_SECRET_KEY in Heroku Config Vars to override
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    
    # Email SMTP (with defaults for deployment)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 25  # Try port 25 (standard SMTP)
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    ADMIN_EMAIL: str = "admin@example.com"
    
    # Resend API (modern email service)
    RESEND_API_KEY: str = "your-resend-api-key"
    RESEND_FROM_EMAIL: str = "noreply@yourdomain.com"
    GITHUB_USERNAME: str = "daniyalareeb"
    
    # CORS - parse from env var JSON string or use defaults
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "https://daniyalareeb.com",
        "https://www.daniyalareeb.com",
        "https://portfolio-frontend-ruddy-eta.vercel.app",
        "https://portfolio-frontend-1lavp6rgq-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-i63wb20qg-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-ibu13yoth-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-9s81f6rvc-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-93ozpdybl-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-fqjgi8t2r-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-gw0hmyqa6-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-6zjtin9bp-daniyalareebs-projects.vercel.app",
        "https://portfolio-frontend-ectpfvtt9-daniyalareebs-projects.vercel.app"
    ]
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from JSON string or return as-is if list."""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try JSON first
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except:
                # Fallback to comma-separated
                return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    # API
    API_V1_STR: str = "/api/v1"

settings = Settings()