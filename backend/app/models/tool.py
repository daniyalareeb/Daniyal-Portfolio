from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Tool(Base):
    __tablename__ = "ai_tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(String(50), nullable=True)
    url = Column(String(500), nullable=False, unique=True)
    pricing = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)         # thumbnail image
    source = Column(String(255), nullable=True)            # where we found it
    auto_fetched = Column(Boolean, default=False)          # was it added by the agent?
    last_checked = Column(DateTime(timezone=True), server_default=func.now())
