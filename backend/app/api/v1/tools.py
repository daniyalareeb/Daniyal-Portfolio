from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.tools_service import list_tools_db
from app.models.tool import Tool

router = APIRouter()

@router.get("/tools/test")
def test_tools(db: Session = Depends(get_db)):
    """Test endpoint to check database connection and basic queries"""
    try:
        # Test basic query without display_order
        count = db.query(Tool).count()
        return {"success": True, "message": f"Database connection OK, {count} tools found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/tools/list")
def tools_list(
    q: str = Query(None),
    category: str = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    rows = list_tools_db(db, q, category, limit)
    data = {
        "items": [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "category": r.category,
                "status": r.status,
                "url": r.url,
                "pricing": r.pricing,
                "image_url": r.image_url,
                "source": r.source,
                "auto_fetched": r.auto_fetched,
                "last_checked": r.last_checked.isoformat() if r.last_checked else None
            }
            for r in rows
        ]
    }
    return {"success": True, "data": data}
