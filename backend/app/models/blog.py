# app/models/blog.py
from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer
from app.database import Base
from datetime import datetime

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False)
    published = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    source = Column(String(200), nullable=True)
    display_order = Column(Integer, default=0)             # for custom ordering
    published_date = Column(DateTime, default=datetime.now)
    last_updated = Column(DateTime, default=datetime.now, onupdate=datetime.now)
