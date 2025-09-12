from pydantic import BaseModel
from typing import List, Optional

class BlogOut(BaseModel):
    id: str
    title: str
    excerpt: str
    content: str
    category: str
    source: str | None = None
    url: str | None = None
    featured: bool = False
    published: str | None = None
    read_time: str

class BlogList(BaseModel):
    items: List[BlogOut]
