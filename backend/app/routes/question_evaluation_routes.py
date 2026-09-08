from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.question_evaluation_schema import QuestionEvaluationPost, QuestionEvaluation
from app.controllers import question_evaluation_controller
from typing import List
from app.core.dependencies import get_db

router = APIRouter(prefix="/api", tags=["Questions Evaluation"])

@router.post("/questions-evaluation", response_model=List[QuestionEvaluation],  status_code= status.HTTP_201_CREATED)
async def evalution_question(question: QuestionEvaluationPost, db: Session = Depends(get_db)):
    return question_evaluation_controller.get_evaluation_question(db, question)

@router.get("/question-evalution-export",  status_code= status.HTTP_200_OK)
async def export_question_evalution(document_id: str, db: Session = Depends(get_db)):
    return question_evaluation_controller.question_evalution_export(db, document_id)
