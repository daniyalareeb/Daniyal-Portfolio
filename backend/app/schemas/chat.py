from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    query: str
    sales: Optional[bool] = False
    session_id: Optional[str] = None

class ChatAnswer(BaseModel):
    answer: str
    timestamp: str
