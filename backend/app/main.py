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
    
    Simplified approach: Trust Railway's persistent volume for data persistence.
    Railway automatically persists the /data directory across deployments.
    """
    import os
    
    # Ensure data directory exists in Railway persistent volume
    data_dir = os.environ.get('RAILWAY_VOLUME_MOUNT_PATH', '/data')  # Use actual Railway mount path
    os.makedirs(data_dir, exist_ok=True)
    print(f"Using Railway persistent data directory: {data_dir}")
    
    # Initialize database tables
    from app.database import engine, Base
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized")
    
    # Simple check: only populate if database is completely empty
    try:
        from app.database import get_db
        from app.models import Tool, Project, BlogPost
        
        db = next(get_db())
        tools_count = db.query(Tool).count()
        projects_count = db.query(Project).count()
        blogs_count = db.query(BlogPost).count()
        
        print(f"Database status: {tools_count} tools, {projects_count} projects, {blogs_count} blogs")
        
        # Only populate if completely empty (first deployment)
        if tools_count == 0 and projects_count == 0 and blogs_count == 0:
            print("Database is empty, populating with sample data...")
            from app.api.v1.admin import populate_database
            result = populate_database(db)
            print(f"Sample data populated: {result}")
        else:
            print("Database has existing data - Railway persistent volume working!")
            
    except Exception as e:
        print(f"Error during startup: {e}")
    
    # Start the automatic blog scheduler for content updates
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
