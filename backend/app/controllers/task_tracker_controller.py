from sqlalchemy.orm import Session
from app.models.task_tracker import TaskTracker
from app.schemas.task_tracker import TaskTrackerCreate, CreateTask, TaskTrackerUpdate
from datetime import date
from sqlalchemy import func

def create_task(db: Session, task_params: CreateTask):
    #step 1 Preparre data
    task=task_params.model_dump()
    find_last_task =  db.query(TaskTracker).order_by(TaskTracker.id.desc()).first() 
    document_id_next=f'DOC-{find_last_task.id + 1}'
    task["document_id"] = document_id_next
    task["status"] = 'Not Started'
    #Step 2 database
    db_task = TaskTracker(**task)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return 'Created'

def get_current_entry_task(db: str):
    current_data = db.query(TaskTracker).filter(func.date(TaskTracker.created_at) == date.today()).all()
    return current_data
    

def get_task(db: Session, document_id: str):
    return db.query(TaskTracker).filter(TaskTracker.document_id == document_id).first()

def get_task_traker(db: Session, skip: int = 0, limit: int = 250):
    return db.query(TaskTracker).order_by(TaskTracker.document_id).offset(skip).limit(limit).all()
