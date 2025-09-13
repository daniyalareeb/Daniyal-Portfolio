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
    
    # ChromaDB (external service)
    CHROMADB_URL: str = "http://localhost:8001"
    
    # OpenRouter API (with default for deployment)
    OPENROUTER_API_KEY: str = "your-api-key-here"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "deepseek/deepseek-chat-v3-0324:free"
    
    # Admin Secret - MUST be changed in production
    ADMIN_SECRET: str = "super-secret-string-change-me"
    ADMIN_PASSWORD: str = "daniyal-admin-2024"
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    
    # Email SMTP (with defaults for deployment)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    ADMIN_EMAIL: str = "admin@example.com"
    GITHUB_USERNAME: str = "daniyalareeb"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # API
    API_V1_STR: str = "/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()