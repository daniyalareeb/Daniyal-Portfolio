from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.cv_service import query_cv

router = APIRouter()

@router.post("/cv/query")
async def cv_query(
    request: dict,
    db: Session = Depends(get_db)
):
    """Query CV using RAG with option for concise or detailed answers."""
    try:
        question = request.get("question")
        detailed = request.get("detailed", False)
        result = await query_cv(question, detailed=detailed)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
