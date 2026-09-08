from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.question_schema import Question, QuestionCreate, QuestionPost,NewQuestion
from app.controllers import question_controller

from app.core.dependencies import get_db

router = APIRouter(prefix="/api", tags=["Questions"])

@router.post("/questions-generation", response_model=list[Question], status_code= status.HTTP_201_CREATED)
async def create_question(question: QuestionPost, db: Session = Depends(get_db)):
    return question_controller.create_question(db, question)

@router.get("/questions/{doc_id}", response_model=list[Question])
async def read_questions(doc_id: str, db: Session = Depends(get_db)):
    return question_controller.get_questions(db, doc_id)

@router.post("/questions",  status_code= status.HTTP_201_CREATED)
async def  create_newQuestion(question: NewQuestion, db: Session = Depends(get_db)):
    return question_controller.new_questionInsert(db, question)
