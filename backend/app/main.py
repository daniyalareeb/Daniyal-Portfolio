"""
DanPortfolio Backend - Main FastAPI Application

This module serves as the entry point for the DanPortfolio backend API.
It configures the FastAPI application with all necessary middleware,
routers, and startup/shutdown events.

Key Features:
- RESTful API with automatic OpenAPI documentation
- CORS middleware for frontend integration
- Static file serving for uploaded images
- Background scheduler for automated content updates
- Modular router architecture for organized endpoints

Author: Daniyal Ahmad
Repository: https://github.com/daniyalareeb/portfolio
"""

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings

# Import all API routers for modular organization
from app.api.v1 import chat, news, tools, cv, contact, projects, admin, manual_admin, auth, data_backup

# Import scheduler for background tasks
from app.services.scheduler import start_scheduler, get_scheduler_status

# Initialize FastAPI application with project metadata
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered portfolio backend with automated content generation",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI documentation
    redoc_url="/redoc"  # ReDoc documentation
)

# Configure CORS middleware for frontend integration
# This allows the Next.js frontend to make requests to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",  # Alternative localhost
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3001",  # Alternative localhost port
        *settings.CORS_ORIGINS     # Additional origins from config
    ],
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],      # Allow all HTTP methods
    allow_headers=["*"],     # Allow all headers
)

# Mount API routers with versioned prefixes
# Each router handles a specific domain of functionality
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["chat"])
app.include_router(news.router, prefix=settings.API_V1_STR, tags=["news"])
app.include_router(tools.router, prefix=settings.API_V1_STR, tags=["tools"])
app.include_router(cv.router, prefix=settings.API_V1_STR, tags=["cv"])
app.include_router(contact.router, prefix=settings.API_V1_STR, tags=["contact"])
app.include_router(projects.router, prefix=settings.API_V1_STR, tags=["projects"])
app.include_router(admin.router, prefix=settings.API_V1_STR, tags=["admin"])
app.include_router(manual_admin.router, prefix=settings.API_V1_STR, tags=["manual-admin"])
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(data_backup.router, prefix=settings.API_V1_STR, tags=["data-backup"])

# Mount static file serving for uploaded images and assets
# This allows serving files uploaded through the admin interface
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def on_startup():
    """
    Application startup event handler.
    
    This function runs when the FastAPI application starts up.
    It initializes background services and schedulers.
    """
    # Create data directory if it doesn't exist
    import os
    import json
    os.makedirs("data", exist_ok=True)
    
    # Initialize database tables
    from app.database import engine, Base
    Base.metadata.create_all(bind=engine)
    
    # Check database status and implement data persistence
    try:
        from app.database import get_db
        from app.models import Tool, Project, BlogPost
        from app.services.data_persistence import DataPersistenceService
        from sqlalchemy.orm import Session
        
        db = next(get_db())
        tools_count = db.query(Tool).count()
        projects_count = db.query(Project).count()
        blogs_count = db.query(BlogPost).count()
        
        print(f"Database status: {tools_count} tools, {projects_count} projects, {blogs_count} blogs")
        
        # Initialize data persistence service
        persistence_service = DataPersistenceService()
        
        # Only populate if completely empty (first time setup)
        if tools_count == 0 and projects_count == 0 and blogs_count == 0:
            print("Database is empty, attempting to restore from backup...")
            
            # Try to restore from multiple backup sources
            restore_success = False
            
            # Try environment backup first
            if persistence_service.restore_from_environment():
                print("Database restored from environment backup")
                restore_success = True
            
            # Try file backup if environment restore failed
            if not restore_success and persistence_service.restore_from_file():
                print("Database restored from file backup")
                restore_success = True
            
            # Try alternative backup locations
            if not restore_success and persistence_service.restore_from_file("data/portfolio_backup.json"):
                print("Database restored from portfolio backup")
                restore_success = True
            
            # If no backup found, auto-populate
            if not restore_success:
                print("No backup found, auto-populating with sample data...")
                from app.api.v1.admin import populate_database
                result = populate_database(db)
                print(f"Auto-population result: {result}")
        else:
            print("Database has data, creating backup...")
            # Create multiple backups for redundancy
            persistence_service.backup_to_environment()
            persistence_service.backup_to_file()
            persistence_service.backup_to_file("data/portfolio_backup.json")
            
    except Exception as e:
        print(f"Error checking database: {e}")
    
    # Start the automatic blog scheduler for content updates
    # This runs background jobs to generate and update blog content
    start_scheduler()

@app.get("/")
def root():
    """
    Root endpoint providing basic API information.
    
    Returns:
        dict: Welcome message with application name
    """
    return {"message": f"Welcome to {settings.APP_NAME} backend!"}

@app.get("/health")
def health():
    """
    Health check endpoint for monitoring and load balancers.
    
    Returns:
        dict: Simple health status indicating the API is running
    """
    return {"ok": True}

@app.get("/api/v1/scheduler/status")
def scheduler_status():
    """
    Get the current status of the background scheduler.
    
    This endpoint provides information about:
    - Whether the scheduler is running
    - Next scheduled job times
    - Job execution history
    
    Returns:
        dict: Scheduler status information
    """
    return get_scheduler_status()
