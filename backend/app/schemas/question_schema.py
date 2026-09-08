
from pydantic import BaseModel
from datetime import datetime

class QuestionBase(BaseModel):
    question_id: str
    document_id: str
    medical_guideline_body: str
    question: str
    medical_guideline_type: str
    category: str
    classification_type: str

class NewQuestion(BaseModel):
    document_id: str
    medical_guideline_body: str
    question: str
    medical_guideline_type: str
    category: str
    classification_type: str

class QuestionPost(BaseModel):
    document_id: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    
    class Config:
        from_attributes = True
