from pydantic import BaseModel
from datetime import date

class DecisionTree(BaseModel):
    document_id: str
    medical_guideline_id: str
    logical_relation: str
    medical_guideline_body: str
    question: str
    category: str
    classification_type: str
    decision_tree_context: str

class DecisionTreePost(BaseModel):
    document_id: str
   
class DecisionTreeCreate(DecisionTree):
    pass

class DecisionTreeUpdate(DecisionTree):
    pass

class DecisionTreeOut(DecisionTree):
    id: str
   
    class Config:
        from_attributes = True