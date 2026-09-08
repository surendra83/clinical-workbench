from sqlalchemy import Integer, Column, String, Text, DateTime, LargeBinary, func
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(200), nullable=False, unique=True, index=True)
    cpt_code = Column(String(50))
    document_type = Column(String(50))
    document_title = Column(Text)
    retrieval_time = Column(DateTime)
    document_source = Column(String(100))
    document_path = Column(String(200))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Correct relationship reference to class name
    guidelines = relationship("MedicalGuideline", back_populates="document")
