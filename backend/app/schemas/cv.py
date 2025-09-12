from pydantic import BaseModel
from typing import List, Optional

class CVQuery(BaseModel):
    question: str

class CVAnswer(BaseModel):
    answer: str
    confidence: float
    sources: List[str]
