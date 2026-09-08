from pydantic import BaseModel
from datetime import datetime

class MedicalGuidelineBase(BaseModel):
    id:int
    document_id: str
    medical_guideline_id: str
    medical_guideline_body: str
    medical_guideline_type: str
    category: str
    classification_type: str
    extraction_time: datetime

class MedicalGuidelineExtract(BaseModel):
    document_id: str    

class MedicalGuidelineCreate(MedicalGuidelineBase):
    pass

class MedicalGuidelineResponse(MedicalGuidelineBase):
    id: int

    class Config:
        from_attributes = True