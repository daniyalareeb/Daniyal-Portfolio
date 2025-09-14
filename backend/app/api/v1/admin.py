from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Tool, Project, BlogPost
from datetime import datetime

router = APIRouter()

@router.post("/populate-database")
def populate_database(db: Session = Depends(get_db)):
    """Populate the database with sample data"""
    try:
        # Clear existing data
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
            status=request.get("status", "Active")
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
            category=request.get("category", "Web Development")
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
        
        # Fetch blogs from RSS sources and update database
        result = await fetch_and_update_blogs(db)
        
        return {
            "success": True,
            "message": "Blog refresh completed successfully",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing blogs: {str(e)}")