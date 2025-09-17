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
from app.api.v1 import chat, news, tools, cv, contact, projects, admin, manual_admin, auth

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
    import shutil
    os.makedirs("data", exist_ok=True)
    
    # Backup existing database if it exists
    if os.path.exists("data/portfolio.db"):
        shutil.copy2("data/portfolio.db", "data/portfolio_backup.db")
        print("Database backed up successfully")
    
    # Initialize database tables
    from app.database import engine, Base
    Base.metadata.create_all(bind=engine)
    
    # Check database status (but don't auto-populate to preserve manual data)
    try:
        from app.database import get_db
        from app.models import Tool, Project, BlogPost
        from sqlalchemy.orm import Session
        
        db = next(get_db())
        tools_count = db.query(Tool).count()
        projects_count = db.query(Project).count()
        blogs_count = db.query(BlogPost).count()
        
        print(f"Database status: {tools_count} tools, {projects_count} projects, {blogs_count} blogs")
        
        # Only populate if completely empty (first time setup)
        if tools_count == 0 and projects_count == 0 and blogs_count == 0:
            # Try to restore from backup first
            if os.path.exists("data/portfolio_backup.db"):
                print("Restoring database from backup...")
                shutil.copy2("data/portfolio_backup.db", "data/portfolio.db")
                # Recreate tables after restore
                Base.metadata.create_all(bind=engine)
                print("Database restored from backup")
            else:
                print("Database is completely empty, auto-populating with sample data...")
                from app.api.v1.admin import populate_database
                result = populate_database(db)
                print(f"Auto-population result: {result}")
        else:
            print("Database has data, preserving existing content")
            
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
