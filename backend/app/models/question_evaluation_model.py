from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class QuestionEvaluation(Base):
    __tablename__ = "question_evaluation"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(String(100), nullable=False)
    document_id = Column(String(200), nullable=False)
    relevancy = Column(DECIMAL(11, 2))
    relevancy_justification = Column(Text)
    accuracy = Column(Integer)
    accuracy_justification = Column(Text)
    clarity = Column(Integer)
    clarity_justification = Column(Text)
    completeness = Column(DECIMAL(11, 2))
    completeness_justification = Column(Text)
    confidence_score = Column(DECIMAL(11, 2))
    justifications_summary = Column(Text)
    confidence_level = Column(String(50))
    evaluation_time = Column(TIMESTAMP, server_default=func.now())
