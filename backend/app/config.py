from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Server Config
    APP_NAME: str = "Daniyal Portfolio Backend"
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    
    # OpenRouter API
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "deepseek/deepseek-chat-v3-0324:free"
    
    # Admin Secret - MUST be changed in production
    ADMIN_SECRET: str = "super-secret-string-change-me"
    ADMIN_PASSWORD: str = "daniyal-admin-2024"
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    
    # Email SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    ADMIN_EMAIL: str
    GITHUB_USERNAME: str = "daniyalareeb"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # API
    API_V1_STR: str = "/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()