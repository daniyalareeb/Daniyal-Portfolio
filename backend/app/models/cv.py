from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class CVDocument(Base):
    __tablename__ = "cv_documents"
    id = Column(String, primary_key=True)     # uuid
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    processed = Column(Boolean, default=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class CVChunk(Base):
    __tablename__ = "cv_chunks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
