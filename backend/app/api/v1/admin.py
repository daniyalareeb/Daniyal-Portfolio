from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Tool, Project, BlogPost, ContactSubmission
from datetime import datetime
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Pydantic models for reorder requests
class ReorderItem(BaseModel):
    id: int
    order: int

class ReorderRequest(BaseModel):
    items: List[ReorderItem]

@router.post("/populate-database")
def populate_database(db: Session = Depends(get_db)):
    """Populate the database with sample data (WARNING: This will clear existing data)"""
    try:
        # Clear existing data (only for manual admin use)
        db.query(Tool).delete()
        db.query(Project).delete()
        db.query(BlogPost).delete()
        db.commit()
        
        # Add sample tools
        tools = [
            Tool(
                name="Midjourney",
                description="AI-powered image generation with stunning artistic results",
                category="Image Generation",
                status="Popular",
                url="https://midjourney.com",
                pricing="Paid"
            ),
            Tool(
                name="ChatGPT",
                description="Advanced conversational AI for various tasks",
                category="Text Generation",
                status="Popular",
                url="https://chat.openai.com",
                pricing="Freemium"
            ),
            Tool(
                name="DALL-E 3",
                description="Create images from text descriptions with high quality",
                category="Image Generation",
                status="Trending",
                url="https://openai.com/dall-e-3",
                pricing="Paid"
            ),
            Tool(
                name="Runway ML",
                description="Professional video editing and generation using AI",
                category="Video Generation",
                status="Trending",
                url="https://runwayml.com",
                pricing="Freemium"
            ),
            Tool(
                name="Gamma",
                description="AI-powered presentation creation and design",
                category="Presentation",
                status="Trending",
                url="https://gamma.app",
                pricing="Freemium"
            )
        ]
        
        for tool in tools:
            db.add(tool)
        
        # Add sample projects
        projects = [
            Project(
                name="AI Portfolio Website",
                description="A modern portfolio website with AI-powered features including chat functionality and dynamic content generation",
                technologies="FastAPI, Next.js, OpenAI, PostgreSQL",
                github_url="https://github.com/daniyalareeb/portfolio",
                url="https://daniyalareeb.me",
                category="Web Development"
            ),
            Project(
                name="Smart Inventory Management",
                description="Backend API for inventory and sales management with automated data analysis",
                technologies="Python, FastAPI, SQLAlchemy, REST APIs",
                github_url="https://github.com/daniyalareeb/inventory-management",
                url=None,
                category="Backend Development"
            ),
            Project(
                name="AI News Aggregator",
                description="Automated news collection and categorization system using AI",
                technologies="Python, BeautifulSoup, FastAPI, Machine Learning",
                github_url="https://github.com/daniyalareeb/ai-news-aggregator",
                url=None,
                category="AI/ML"
            )
        ]
        
        for project in projects:
            db.add(project)
        
        # Add sample blog posts
        blogs = [
            BlogPost(
                title="AI in Healthcare: Revolutionizing Patient Care",
                excerpt="Exploring how artificial intelligence is transforming healthcare delivery and patient outcomes.",
                content="Artificial intelligence is revolutionizing healthcare in unprecedented ways...",
                category="AI",
                published=True,
                featured=True,
                source="AI Healthcare Research"
            ),
            BlogPost(
                title="Building Scalable APIs with FastAPI",
                excerpt="Best practices for creating high-performance APIs using FastAPI framework.",
                content="FastAPI has become one of the most popular Python web frameworks...",
                category="Backend Development",
                published=True,
                featured=False,
                source="Tech Blog"
            ),
            BlogPost(
                title="The Future of Machine Learning",
                excerpt="Trends and predictions for the next decade in machine learning and AI.",
                content="Machine learning continues to evolve at a rapid pace...",
                category="AI",
                published=True,
                featured=True,
                source="ML Research"
            )
        ]
        
        for blog in blogs:
            db.add(blog)
        
        db.commit()
        
        return {
            "success": True,
            "message": "Database populated successfully",
            "data": {
                "tools_added": len(tools),
                "projects_added": len(projects),
                "blogs_added": len(blogs)
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error populating database: {str(e)}")

@router.post("/add-tool-public")
def add_tool_public(
    request: dict,
    db: Session = Depends(get_db)
):
    """Public endpoint to add tools without authentication"""
    try:
        tool = Tool(
            name=request.get("name"),
            description=request.get("description"),
            category=request.get("category"),
            url=request.get("url"),
            pricing=request.get("pricing", "Free"),
            status=request.get("status", "Active"),
            image_url=request.get("image_url")
        )
        db.add(tool)
        db.commit()
        db.refresh(tool)
        
        return {
            "success": True,
            "message": "Tool added successfully",
            "data": {"tool_id": tool.id, "name": tool.name}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding tool: {str(e)}")

@router.post("/add-project-public")
def add_project_public(
    request: dict,
    db: Session = Depends(get_db)
):
    """Public endpoint to add projects without authentication"""
    try:
        project = Project(
            name=request.get("name"),
            description=request.get("description"),
            technologies=request.get("technologies"),
            github_url=request.get("github_url"),
            url=request.get("url"),
            category=request.get("category", "Web Development"),
            image_url=request.get("image_url")
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        
        return {
            "success": True,
            "message": "Project added successfully",
            "data": {"project_id": project.id, "name": project.name}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding project: {str(e)}")

@router.get("/list-tools-public")
def list_tools_public(db: Session = Depends(get_db)):
    """Public endpoint to list tools without authentication"""
    try:
        tools = db.query(Tool).all()
        return {
            "success": True,
            "data": tools
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing tools: {str(e)}")

@router.post("/migrate-database")
def migrate_database(db: Session = Depends(get_db)):
    """Run database migration to add image_url columns"""
    try:
        from sqlalchemy import text
        
        # Add to ai_tools table
        try:
            result = db.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'ai_tools' AND column_name = 'image_url'
            """))
            
            if result.fetchone() is None:
                db.execute(text("ALTER TABLE ai_tools ADD COLUMN image_url VARCHAR(500)"))
                db.commit()
                tools_msg = "ai_tools.image_url column added successfully!"
            else:
                tools_msg = "ai_tools.image_url column already exists"
        except Exception as e:
            tools_msg = f"Error with ai_tools: {str(e)}"
        
        # Add to projects table
        try:
            result = db.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'image_url'
            """))
            
            if result.fetchone() is None:
                db.execute(text("ALTER TABLE projects ADD COLUMN image_url VARCHAR(500)"))
                db.commit()
                projects_msg = "projects.image_url column added successfully!"
            else:
                projects_msg = "projects.image_url column already exists"
        except Exception as e:
            projects_msg = f"Error with projects: {str(e)}"
        
        return {
            "success": True,
            "message": "Migration completed",
            "data": {
                "ai_tools": tools_msg,
                "projects": projects_msg
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/update-tool-categories")
def update_tool_categories(db: Session = Depends(get_db)):
    """Clear all tools and reset to use new professional categories"""
    try:
        # Professional categories for display
        professional_categories = [
            "AI Chat & Assistant", "Image & Visual AI", "Video & Media AI", "Audio & Voice AI", 
            "Development & Code", "Content Creation", "Productivity & Automation", "Design & UX",
            "Business & Marketing", "Research & Analytics", "Other"
        ]
        
        # Count tools to be deleted
        tools_count = db.query(Tool).count()
        
        # Delete all tools
        db.query(Tool).delete()
        db.commit()
        
        return {
            "success": True,
            "message": f"Cleared {tools_count} tools. You can now add new tools with professional categories: {', '.join(professional_categories)}",
            "data": {"deleted_count": tools_count, "available_categories": professional_categories}
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/update-blog-categories")
def update_blog_categories(db: Session = Depends(get_db)):
    """Clear all blogs and reset to use new professional categories"""
    try:
        # Professional blog categories for display
        professional_blog_categories = [
            "AI Research & Development", "Machine Learning", "AI Applications", 
            "AI Business & Industry", "AI Ethics & Policy", "AI Tools & Platforms", 
            "AI News & Trends", "Other"
        ]
        
        # Count blogs to be deleted
        blogs_count = db.query(BlogPost).count()
        
        # Delete all blogs
        db.query(BlogPost).delete()
        db.commit()
        
        return {
            "success": True,
            "message": f"Cleared {blogs_count} blogs. Fresh blogs will be fetched with professional categories: {', '.join(professional_blog_categories)}",
            "data": {"deleted_count": blogs_count, "available_categories": professional_blog_categories}
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e)
        }
@router.get("/list-projects-public")
def list_projects_public(db: Session = Depends(get_db)):
    """Public endpoint to list projects without authentication"""
    try:
        projects = db.query(Project).all()
        return {
            "success": True,
            "data": projects
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing projects: {str(e)}")

@router.get("/list-blogs-public")
def list_blogs_public(db: Session = Depends(get_db)):
    """Public endpoint to list blogs without authentication"""
    try:
        blogs = db.query(BlogPost).all()
        return {
            "success": True,
            "data": blogs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing blogs: {str(e)}")

@router.delete("/delete-tool-public/{tool_id}")
def delete_tool_public(tool_id: int, db: Session = Depends(get_db)):
    """Public endpoint to delete tools without authentication"""
    try:
        tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if not tool:
            return {"success": False, "error": "Tool not found"}
        
        db.delete(tool)
        db.commit()
        
        return {"success": True, "message": "Tool deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting tool: {str(e)}")

@router.delete("/delete-project-public/{project_id}")
def delete_project_public(project_id: int, db: Session = Depends(get_db)):
    """Public endpoint to delete projects without authentication"""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"success": False, "error": "Project not found"}
        
        db.delete(project)
        db.commit()
        
        return {"success": True, "message": "Project deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")

@router.delete("/delete-blog-public/{blog_id}")
def delete_blog_public(blog_id: int, db: Session = Depends(get_db)):
    """Public endpoint to delete blogs without authentication"""
    try:
        blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
        if not blog:
            return {"success": False, "error": "Blog not found"}
        
        db.delete(blog)
        db.commit()
        
        return {"success": True, "message": "Blog deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting blog: {str(e)}")

@router.post("/refresh-blogs")
async def refresh_blogs(db: Session = Depends(get_db)):
    """Public endpoint to refresh blogs from external RSS sources"""
    try:
        from app.services.blog_service import fetch_and_update_blogs
        from app.services.scheduler import reset_blog_scheduler
        
        # Fetch blogs from RSS sources and update database
        result = await fetch_and_update_blogs(db)
        
        # Reset the scheduler timer to run again in 3 days from now
        reset_blog_scheduler()
        
        return {
            "success": True,
            "message": "Blog refresh completed successfully and timer reset",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing blogs: {str(e)}")

@router.get("/scheduler-status")
async def get_scheduler_status():
    """Get the current status of the background scheduler"""
    try:
        from app.services.scheduler import get_scheduler_status, get_next_blog_update_time
        
        status = get_scheduler_status()
        
        # Add next blog update time for better admin display
        next_blog_time = get_next_blog_update_time()
        if next_blog_time:
            # Update the blogs job with the actual next run time
            for job in status.get("jobs", []):
                if job.get("id") == "blogs":
                    job["next_run_time"] = next_blog_time
                    break
        
        return {
            "success": True,
            "data": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting scheduler status: {str(e)}")

# Drag and Drop Reorder Endpoints
@router.put("/admin/reorder-tools")
def reorder_tools(request: ReorderRequest, db: Session = Depends(get_db)):
    """Reorder tools based on drag and drop"""
    try:
        for item in request.items:
            tool = db.query(Tool).filter(Tool.id == item.id).first()
            if tool:
                tool.display_order = item.order
                db.commit()
        
        return {
            "success": True,
            "message": f"Successfully reordered {len(request.items)} tools"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error reordering tools: {str(e)}")

@router.put("/admin/reorder-projects")
def reorder_projects(request: ReorderRequest, db: Session = Depends(get_db)):
    """Reorder projects based on drag and drop"""
    try:
        for item in request.items:
            project = db.query(Project).filter(Project.id == item.id).first()
            if project:
                project.display_order = item.order
                db.commit()
        
        return {
            "success": True,
            "message": f"Successfully reordered {len(request.items)} projects"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error reordering projects: {str(e)}")

@router.put("/admin/reorder-blogs")
def reorder_blogs(request: ReorderRequest, db: Session = Depends(get_db)):
    """Reorder blogs based on drag and drop"""
    try:
        for item in request.items:
            blog = db.query(BlogPost).filter(BlogPost.id == item.id).first()
            if blog:
                blog.display_order = item.order
                db.commit()
        
        return {
            "success": True,
            "message": f"Successfully reordered {len(request.items)} blogs"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error reordering blogs: {str(e)}")

@router.post("/migrate-database")
def migrate_database():
    """Run database migration to add display_order columns"""
    try:
        import subprocess
        import sys
        import os
        
        # Change to backend directory
        backend_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..')
        result = subprocess.run([
            sys.executable, 'add_display_order_columns.py'
        ], cwd=backend_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            return {
                "success": True,
                "message": "Database migration completed successfully",
                "output": result.stdout
            }
        else:
            return {
                "success": False,
                "message": "Database migration failed",
                "error": result.stderr
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Migration error: {str(e)}")