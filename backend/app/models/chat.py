from sqlalchemy import Column, String, Text, Integer
from app.database import Base

class ChatMessage(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
