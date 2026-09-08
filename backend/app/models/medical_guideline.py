from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class MedicalGuideline(Base):
    __tablename__ = "medical_guidelines"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(200), ForeignKey('documents.document_id'), nullable=False, index=True)
    medical_guideline_id = Column(String(255), nullable=False, index=True)
    medical_guideline_body = Column(Text, nullable=False)
    medical_guideline_type = Column(String(100), nullable=False)
    category = Column(String(30), nullable=False)
    classification_type = Column(String(100), nullable=False)
    extraction_time = Column(DateTime, nullable=False)

    # Optional: Define relationship to Document model
    document = relationship('Document', back_populates="guidelines")