from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QuestionEvaluationBase(BaseModel):
    question_id: str
    document_id: str
    relevancy: Optional[float]
    relevancy_justification: Optional[str]
    accuracy: Optional[int]
    accuracy_justification: Optional[str]
    clarity: Optional[int]
    clarity_justification: Optional[str]
    completeness: Optional[float]
    completeness_justification: Optional[str]
    confidence_score: Optional[float]
    justifications_summary: Optional[str]
    confidence_level: Optional[str]

class QuestionEvaluationPost(BaseModel):
    question_id: str
    document_id: str

class QuestionEvaluationCreate(QuestionEvaluationBase):
    pass

class QuestionEvaluation(QuestionEvaluationBase):
    id: int
    
    class Config:
        from_attributes = True
