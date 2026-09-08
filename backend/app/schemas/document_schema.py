from pydantic import BaseModel
from datetime import date

class DocumentBase(BaseModel):
    document_id: str
    cpt_code: str
    document_type: str
    document_title: str
    document_path: str

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    document_id: str
   
    class Config:
        from_attributes = True