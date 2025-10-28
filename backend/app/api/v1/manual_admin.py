from fastapi import APIRouter, Header, HTTPException, Depends, UploadFile, File, Form, Request
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Tool, Project, BlogPost
from app.config import settings
from app.core.security import get_security_manager
from app.services.chat_service import ask_model
from typing import Optional
from datetime import datetime
import os
import uuid
import shutil
import json
import urllib.parse
import time

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

# Tool Management
class ToolCreate(BaseModel):
    name: str
    description: str
    url: str
    category: str
    pricing: Optional[str] = None
    status: Optional[str] = "Active"
    image_url: Optional[str] = None

@router.post("/add-tool")
async def add_tool(
    request: Request,
    tool: ToolCreate, 
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Manually add a new AI tool."""
    try:
        # Check if tool already exists
        existing = db.query(Tool).filter(Tool.url == tool.url).first()
        if existing:
            return {"success": False, "error": "Tool with this URL already exists"}
        
        new_tool = Tool(
            name=tool.name,
            description=tool.description,
            url=tool.url,
            category=tool.category,
            pricing=tool.pricing,
            status=tool.status,
            image_url=tool.image_url,
            auto_fetched=False,
            source="Manual Admin"
        )
        db.add(new_tool)
        db.commit()
        db.refresh(new_tool)
        
        return {"success": True, "message": "Tool added successfully", "data": new_tool}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.delete("/delete-tool/{tool_id}")
async def delete_tool(
    request: Request,
    tool_id: int,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Delete a tool by ID."""
    try:
        tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if not tool:
            return {"success": False, "error": "Tool not found"}
        
        db.delete(tool)
        db.commit()
        
        return {"success": True, "message": "Tool deleted successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

# Project Management
class ProjectCreate(BaseModel):
    name: str
    description: str
    url: Optional[str] = None
    github_url: Optional[str] = None
    category: str
    technologies: Optional[str] = None
    image_url: Optional[str] = None

@router.post("/add-project")
async def add_project(
    request: Request,
    project: ProjectCreate, 
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Manually add a new project."""
    try:
        new_project = Project(
            name=project.name,
            description=project.description,
            url=project.url,
            github_url=project.github_url,
            category=project.category,
            technologies=project.technologies,
            image_url=project.image_url
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        
        return {"success": True, "message": "Project added successfully", "data": new_project}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.delete("/delete-project/{project_id}")
async def delete_project(
    request: Request,
    project_id: int,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Delete a project by ID."""
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"success": False, "error": "Project not found"}
        
        db.delete(project)
        db.commit()
        
        return {"success": True, "message": "Project deleted successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.post("/upload-image-public")
async def upload_image_public(
    request: Request,
    file: UploadFile = File(...)
):
    """Public endpoint to upload image files without authentication"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            return {"success": False, "error": "Only image files are allowed"}
        
        # Validate file size (max 5MB)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        if file_size > 5 * 1024 * 1024:  # 5MB
            return {"success": False, "error": "File size too large. Maximum 5MB allowed"}
        
        # Generate unique filename
        import uuid
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Create uploads directory in persistent volume if it doesn't exist
        import os
        # Use persistent volume for file storage (Heroku-friendly)
        persistent_path = os.environ.get('VOLUME_MOUNT_PATH', './data')
        upload_dir = os.path.join(persistent_path, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Return the URL - use the persistent path
        image_url = f"/static/uploads/{unique_filename}"
        return {
            "success": True, 
            "message": "Image uploaded successfully",
            "data": {"image_url": image_url}
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/upload-image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    session: dict = Depends(verify_admin_session)
):
    """Upload an image file for project preview."""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            return {"success": False, "error": "Only image files are allowed"}
        
        # Validate file size (max 5MB)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        if file_size > 5 * 1024 * 1024:  # 5MB
            return {"success": False, "error": "File size too large. Maximum 5MB allowed"}
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Save file in persistent volume (Heroku-friendly)
        persistent_path = os.environ.get('VOLUME_MOUNT_PATH', './data')
        upload_dir = os.path.join(persistent_path, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Return the URL path
        image_url = f"/static/uploads/{unique_filename}"
        
        return {
            "success": True, 
            "message": "Image uploaded successfully", 
            "data": {"image_url": image_url}
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.put("/update-project-public/{project_id}")
async def update_project_public(
    request: Request,
    project_id: int,
    db: Session = Depends(get_db)
):
    """Public endpoint to update projects without authentication"""
    try:
        # Get the project data from request body
        body = await request.json()
        
        # Find the project
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"success": False, "error": "Project not found"}
        
        # Update project fields
        if "name" in body:
            project.name = body["name"]
        if "description" in body:
            project.description = body["description"]
        if "url" in body:
            project.url = body["url"]
        if "github_url" in body:
            project.github_url = body["github_url"]
        if "category" in body:
            project.category = body["category"]
        if "technologies" in body:
            project.technologies = body["technologies"]
        if "image_url" in body:
            project.image_url = body["image_url"]
        
        db.commit()
        db.refresh(project)
        
        return {
            "success": True,
            "message": "Project updated successfully",
            "data": {"project_id": project.id, "name": project.name}
        }
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.put("/update-project/{project_id}")
async def update_project(
    request: Request,
    project_id: int,
    project: ProjectCreate,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Update a project by ID."""
    try:
        existing_project = db.query(Project).filter(Project.id == project_id).first()
        if not existing_project:
            return {"success": False, "error": "Project not found"}
        
        # Update project fields
        existing_project.name = project.name
        existing_project.description = project.description
        existing_project.url = project.url
        existing_project.github_url = project.github_url
        existing_project.category = project.category
        existing_project.technologies = project.technologies
        existing_project.image_url = project.image_url
        
        db.commit()
        
        return {"success": True, "message": "Project updated successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.put("/update-tool-public/{tool_id}")
async def update_tool_public(
    request: Request,
    tool_id: int,
    db: Session = Depends(get_db)
):
    """Public endpoint to update tools without authentication"""
    try:
        # Get the tool data from request body
        body = await request.json()
        
        # Find the tool
        tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if not tool:
            return {"success": False, "error": "Tool not found"}
        
        # Update tool fields
        if "name" in body:
            tool.name = body["name"]
        if "description" in body:
            tool.description = body["description"]
        if "url" in body:
            tool.url = body["url"]
        if "category" in body:
            tool.category = body["category"]
        if "pricing" in body:
            tool.pricing = body["pricing"]
        if "status" in body:
            tool.status = body["status"]
        if "image_url" in body:
            tool.image_url = body["image_url"]
        
        db.commit()
        db.refresh(tool)
        
        return {
            "success": True,
            "message": "Tool updated successfully",
            "data": {"tool_id": tool.id, "name": tool.name}
        }
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.put("/update-tool/{tool_id}")
async def update_tool(
    request: Request,
    tool_id: int,
    tool: ToolCreate,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Update a tool by ID."""
    try:
        existing_tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if not existing_tool:
            return {"success": False, "error": "Tool not found"}
        
        # Update tool fields
        existing_tool.name = tool.name
        existing_tool.description = tool.description
        existing_tool.url = tool.url
        existing_tool.category = tool.category
        existing_tool.pricing = tool.pricing
        existing_tool.status = tool.status
        existing_tool.image_url = tool.image_url
        
        db.commit()
        
        return {"success": True, "message": "Tool updated successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

# Blog Generation
class BlogGenerate(BaseModel):
    topic: str
    category: str
    tone: str = "professional"  # professional, casual, technical
    length: str = "medium"  # short, medium, long

@router.post("/generate-blog")
async def generate_blog(
    request: Request,
    blog: BlogGenerate, 
    session: dict = Depends(verify_admin_session)
):
    """Generate a proper blog post that feels like you wrote it."""
    try:
        # Create a detailed prompt for blog generation
        prompt = f"""
        Write a natural, engaging blog post about "{blog.topic}" in the {blog.category} category.
        
        Requirements:
        - Write in a {blog.tone} tone that feels conversational and authentic
        - Make it {blog.length} length (2-3 paragraphs for medium, 4-5 for long)
        - Write as if Daniyal Areeb (a software engineer and AI enthusiast) wrote it personally
        - Include personal insights, experiences, and real-world examples
        - Make it engaging and informative without being overly technical
        - Use natural language flow - avoid bullet points, asterisks, or excessive formatting
        - Write in complete sentences and paragraphs
        - Include practical examples or use cases that readers can relate to
        - End with a thoughtful conclusion that ties everything together
        - Make it feel like a genuine blog post someone would actually read
        
        Write the blog post in clean markdown format with proper headings and natural paragraph flow.
        Avoid using asterisks (*), hyphens (-), or bullet points for lists.
        """
        
        # Generate the blog content
        content = await ask_model(prompt, mode="home")
        
        # Extract title from the first line
        lines = content.split('\n')
        title = lines[0].replace('# ', '').replace('#', '').strip()
        
        # Create excerpt from first paragraph
        excerpt = ""
        for line in lines:
            if line.strip() and not line.startswith('#') and not line.startswith('*'):
                excerpt = line.strip()
                break
        
        return {
            "success": True, 
            "data": {
                "title": title,
                "excerpt": excerpt[:200] + "..." if len(excerpt) > 200 else excerpt,
                "content": content,
                "category": blog.category,
                "topic": blog.topic
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/save-generated-blog")
async def save_generated_blog(
    request: Request,
    blog_data: dict, 
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Save a generated blog post to the database."""
    try:
        new_blog = BlogPost(
            title=blog_data["title"],
            excerpt=blog_data["excerpt"],
            content=blog_data["content"],
            category=blog_data["category"],
            published=True,
            featured=False,
            source="AI Generated",
            published_date=datetime.now()
        )
        db.add(new_blog)
        db.commit()
        db.refresh(new_blog)
        
        return {"success": True, "message": "Blog saved successfully", "data": new_blog}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

@router.delete("/delete-blog/{blog_id}")
async def delete_blog(
    request: Request,
    blog_id: int,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Delete a blog by ID."""
    try:
        blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
        if not blog:
            return {"success": False, "error": "Blog not found"}
        
        db.delete(blog)
        db.commit()
        
        return {"success": True, "message": "Blog deleted successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

# List endpoints
@router.get("/list-tools")
async def list_tools(
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """List all tools."""
    try:
        tools = db.query(Tool).order_by(Tool.id.desc()).all()
        return {"success": True, "data": tools}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/list-projects")
async def list_projects(
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """List all projects."""
    try:
        projects = db.query(Project).order_by(Project.id.desc()).all()
        return {"success": True, "data": projects}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/list-blogs")
async def list_blogs(
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """List all blogs."""
    try:
        blogs = db.query(BlogPost).order_by(BlogPost.id.desc()).all()
        return {"success": True, "data": blogs}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/delete-all-blogs")
async def delete_all_blogs(
    request: Request,
    session: dict = Depends(verify_admin_session), 
    db: Session = Depends(get_db)
):
    """Delete all blog posts."""
    try:
        count = db.query(BlogPost).delete()
        db.commit()
        return {"success": True, "message": f"Deleted {count} blogs successfully"}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

# Dashboard Stats
@router.get("/manual-stats")
async def get_manual_stats(
    session: dict = Depends(verify_admin_session),
    db: Session = Depends(get_db)
):
    """Get statistics for manually added content."""
    try:
        manual_tools = db.query(Tool).filter(Tool.auto_fetched == False).count()
        auto_tools = db.query(Tool).filter(Tool.auto_fetched == True).count()
        total_projects = db.query(Project).count()
        total_blogs = db.query(BlogPost).count()
        
        # Get category breakdown
        tool_categories = db.query(Tool.category).distinct().all()
        project_categories = db.query(Project.category).distinct().all()
        blog_categories = db.query(BlogPost.category).distinct().all()
        
        return {
            "success": True,
            "data": {
                "tools": {
                    "manual": manual_tools,
                    "auto": auto_tools,
                    "total": manual_tools + auto_tools,
                    "categories": [cat[0] for cat in tool_categories]
                },
                "projects": {
                    "total": total_projects,
                    "categories": [cat[0] for cat in project_categories]
                },
                "blogs": {
                    "total": total_blogs,
                    "categories": [cat[0] for cat in blog_categories]
                }
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
