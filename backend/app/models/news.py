from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    date = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    source_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
