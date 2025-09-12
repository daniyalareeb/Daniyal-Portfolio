from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.cv_service import query_cv

router = APIRouter()

@router.post("/cv/query")
async def cv_query(
    question: str,
    detailed: bool = Query(False, description="Get detailed answer (default: concise)"),
    db: Session = Depends(get_db)
):
    """Query CV using RAG with option for concise or detailed answers."""
    try:
        result = await query_cv(question, detailed=detailed)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
