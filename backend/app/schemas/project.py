from pydantic import BaseModel
from typing import List, Optional

class ProjectOut(BaseModel):
    id: str
    name: str
    description: str | None = None
    url: str
    homepage: str | None = None
    tags: str | None = None

class ProjectList(BaseModel):
    items: List[ProjectOut]
