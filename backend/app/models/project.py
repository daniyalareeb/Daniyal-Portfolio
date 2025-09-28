from sqlalchemy import Column, String, Text, Integer
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False, default="Web Development")
    technologies = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)             # for custom ordering
