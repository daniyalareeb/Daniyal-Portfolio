from pydantic import BaseModel
from typing import List, Optional

class ToolOut(BaseModel):
    id: str
    name: str
    description: str
    category: str
    status: str | None = None
    url: str
    pricing: str | None = None

class ToolList(BaseModel):
    items: List[ToolOut]
