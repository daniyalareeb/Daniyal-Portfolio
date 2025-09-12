from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.models.project import Project

router = APIRouter()

@router.get("/projects/list", response_model=APIResponse)
def projects_list(db: Session = Depends(get_db)):
    items = db.query(Project).order_by(Project.id.desc()).all()
    data = {
        "items": [
            {
                "id": p.id, 
                "name": p.name, 
                "description": p.description, 
                "url": p.url,
                "github_url": p.github_url,
                "category": p.category,
                "technologies": p.technologies,
                "image_url": p.image_url
            } for p in items
        ]
    }
    return APIResponse(success=True, data=data)
