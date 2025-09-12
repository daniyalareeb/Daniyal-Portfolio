from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat_service import ask_model

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    mode: str | None = "home"  # "home" or "cv"

@router.post("/send")
async def send_chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=422, detail="message is required")
    try:
        answer = await ask_model(req.message, mode=req.mode)
        return {"success": True, "data": {"answer": answer}}
    except Exception as e:
        # Never crash UI
        return {"success": False, "error": str(e), "data": {"answer": "Backend had an issue contacting the AI right now. Please try again."}}