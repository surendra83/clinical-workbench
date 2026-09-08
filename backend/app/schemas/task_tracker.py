from pydantic import BaseModel
from datetime import date

class TaskTrackerBase(BaseModel):
    cpt_code: str
    payer: str
    state: str
    document_type: str
    document_title: str
    due_date: date
    priority: str
    status: str
    p_step: str


class CreateTask(BaseModel):
    cpt_code: str
    payer: str
    state: str
    document_type: str
    document_title: str
    due_date: date
    priority: str

class TaskTrackerCreate(TaskTrackerBase):
    pass

class TaskTrackerUpdate(TaskTrackerBase):
    pass

class TaskTrackerOut(TaskTrackerBase):
    document_id: str

    class Config:
        from_attributes = True