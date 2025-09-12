from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.models.blog import BlogPost

router = APIRouter()

@router.get("/news/list", response_model=APIResponse)
def list_blogs(db: Session = Depends(get_db)):
    items = db.query(BlogPost).order_by(BlogPost.id.desc()).all()
    # shape like frontend expects
    data = {
        "items": [
            {
                "id": b.id, "title": b.title, "excerpt": b.excerpt, "category": b.category,
                "published": b.published, "featured": b.featured,
                "content": b.content
            } for b in items
        ]
    }
    return APIResponse(success=True, data=data)
