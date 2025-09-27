from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.models.blog import BlogPost

router = APIRouter()

@router.get("/news/list", response_model=APIResponse)
def list_blogs(db: Session = Depends(get_db)):
    # Try to order by display_order first, fallback to id if column doesn't exist
    try:
        items = db.query(BlogPost).order_by(BlogPost.display_order.asc(), BlogPost.id.desc()).all()
    except Exception as e:
        # If display_order column doesn't exist, fallback to id ordering
        print(f"display_order column not found, using id ordering: {e}")
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
