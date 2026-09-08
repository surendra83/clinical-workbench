from sqlalchemy import Column, Integer, String, Text, DateTime, TIMESTAMP, func
from app.database import Base

class DecisionTree(Base):
    __tablename__ = "decision_trees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(200), nullable=False)
    medical_guideline_id = Column(String(255), nullable=False)
    logical_relation = Column(String(255), nullable=True)
    medical_guideline_body = Column(Text, nullable=True)
    question = Column(Text, nullable=True)
    category = Column(String(30), nullable=True)
    classification_type = Column(String(100), nullable=True)
    decision_tree_context = Column(Text, nullable=False)
    
    generation_time = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())