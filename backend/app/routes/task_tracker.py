from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db

from app.schemas.task_tracker import TaskTrackerCreate, TaskTrackerOut,CreateTask, TaskTrackerUpdate
from app.controllers import task_tracker_controller as crud

router = APIRouter(prefix="/api", tags=["Task Tracker"])

@router.post("/task-tracker", status_code= status.HTTP_201_CREATED)
async def create_taskTracker(task_tracker: CreateTask, db: Session = Depends(get_db)):
    return crud.create_task(db, task_tracker)


@router.get("/current-entry-task", response_model=list[TaskTrackerOut])
async def current_entry_task(db: Session = Depends(get_db)):
    return crud.get_current_entry_task(db)

@router.get("/task-tracker", response_model=list[TaskTrackerOut])
async def read_taskTrackers(skip: int = 0, limit: int = 250, db: Session = Depends(get_db)):
    return crud.get_task_traker(db, skip, limit)

@router.get("/task-tracker/{doc_id}", response_model=TaskTrackerOut, status_code=status.HTTP_200_OK)
async def read_taskTracker(doc_id: str, db: Session = Depends(get_db)):
    db_task_tracker = crud.get_task(db, doc_id)
    if not db_task_tracker:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task_tracker
