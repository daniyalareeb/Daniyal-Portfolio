from fastapi import APIRouter, Header, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.tools_service import fetch_and_update_tools
from app.services.scheduler import get_scheduler_status, reset_blog_scheduler
from app.models import Tool, BlogPost, Project
from app.config import settings
from app.core.security import get_security_manager
from typing import Optional
import json

router = APIRouter()

def verify_admin_secret(x_admin_secret: Optional[str] = Header(None)):
    """Verify admin secret header."""
    if x_admin_secret != settings.ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Invalid admin secret")
    return x_admin_secret

def verify_admin_session(request: Request):
    """Verify admin session cookie using JWT."""
    security_manager = get_security_manager()
    return security_manager.verify_admin_session(request)

@router.post("/refresh-tools")
async def refresh_tools(admin_secret: str = Depends(verify_admin_secret), db: Session = Depends(get_db)):
    """Refresh tools from external sources."""
    try:
        result = await fetch_and_update_tools(db)
        return {"success": True, "message": "Tools refreshed successfully", "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/tools/status")
async def tools_status(session: dict = Depends(verify_admin_session), db: Session = Depends(get_db)):
    """Get tools status and statistics."""
    try:
        total_tools = db.query(Tool).count()
        auto_fetched = db.query(Tool).filter(Tool.auto_fetched == True).count()
        manual_tools = db.query(Tool).filter(Tool.auto_fetched == False).count()
        
        categories = db.query(Tool.category).distinct().all()
        category_count = len(categories)
        
        return {
            "success": True,
            "data": {
                "total_tools": total_tools,
                "auto_fetched": auto_fetched,
                "manual_tools": manual_tools,
                "categories": [cat[0] for cat in categories],
                "category_count": category_count
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/refresh-blogs")
async def refresh_blogs(
    request: Request,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Refresh blogs from external sources and reset the 3-day timer."""
    try:
        from app.services.blog_service import fetch_and_update_blogs
        
        # Refresh the blogs
        result = await fetch_and_update_blogs(db)
        
        # Reset the scheduler timer to run again in 3 days from now
        scheduler_reset = reset_blog_scheduler()
        
        return {
            "success": True, 
            "message": "Blogs refreshed successfully and timer reset to 3 days", 
            "data": result,
            "scheduler_reset": scheduler_reset
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/dashboard")
async def admin_dashboard(session: dict = Depends(verify_admin_session), db: Session = Depends(get_db)):
    """Admin dashboard with overview of all data."""
    try:
        # Get counts
        tools_count = db.query(Tool).count()
        blogs_count = db.query(BlogPost).count()
        projects_count = db.query(Project).count()
        
        # Get recent items
        recent_tools = db.query(Tool).order_by(Tool.id.desc()).limit(5).all()
        recent_blogs = db.query(BlogPost).order_by(BlogPost.id.desc()).limit(5).all()
        recent_projects = db.query(Project).order_by(Project.id.desc()).limit(5).all()
        
        # Get category breakdown
        tool_categories = db.query(Tool.category).distinct().all()
        blog_categories = db.query(BlogPost.category).distinct().all()
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_tools": tools_count,
                    "total_blogs": blogs_count,
                    "total_projects": projects_count
                },
                "recent_tools": [
                    {
                        "id": tool.id,
                        "name": tool.name,
                        "category": tool.category,
                        "status": tool.status
                    } for tool in recent_tools
                ],
                "recent_blogs": [
                    {
                        "id": blog.id,
                        "title": blog.title,
                        "category": blog.category,
                        "featured": blog.featured
                    } for blog in recent_blogs
                ],
                "recent_projects": [
                    {
                        "id": project.id,
                        "name": project.name,
                        "url": project.url
                    } for project in recent_projects
                ],
                "categories": {
                    "tools": [cat[0] for cat in tool_categories],
                    "blogs": [cat[0] for cat in blog_categories]
                },
                "scheduler": {
                    "is_running": True,  # Scheduler is always running when app starts
                    "blog_interval": "3 days",
                    "project_interval": "2 hours",
                    "last_blog_update": recent_blogs[0].last_updated.isoformat() if recent_blogs else None,
                    "next_blog_update": "Every 3 days automatically",
                    "blog_update_status": "Active - Next update in 3 days"
                }
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}



@router.get("/scheduler-status")
async def get_scheduler_status_endpoint(session: dict = Depends(verify_admin_session)):
    """Get detailed scheduler status including next blog update time."""
    try:
        status = get_scheduler_status()
        return {"success": True, "data": status}
    except Exception as e:
        return {"success": False, "error": str(e)}
