from sqlalchemy import Column, Integer, String, Text, DateTime, TIMESTAMP, func
from app.database import Base

class QuestionGeneration(Base):
    __tablename__ = "questions_generation"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id = Column(String(200), nullable=False)
    question_id = Column(String(100), nullable=False)
    medical_guideline_id = Column(String(255), nullable=False)
    medical_guideline_body = Column(Text, nullable=False)
    question = Column(Text, nullable=False)
    medical_guideline_type = Column(String(100), nullable=False)
    category = Column(String(30), nullable=False)
    classification_type = Column(String(100), nullable=False)
    generation_time = Column(DateTime, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
