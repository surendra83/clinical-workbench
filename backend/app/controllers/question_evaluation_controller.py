from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.question_evaluation_model import QuestionEvaluation
from app.schemas.question_evaluation_schema import QuestionEvaluationPost
from sqlalchemy.exc import SQLAlchemyError
from app.database import engine
from fastapi import Response
import pandas as pd
import numpy as np
import json
import io

def get_evaluation_question(db: Session, question_evaluation_info: QuestionEvaluationPost):
    document_id = question_evaluation_info.document_id.upper()
    question_id = question_evaluation_info.question_id.upper()
    if document_id and question_id:
        try:
            result = db.query(QuestionEvaluation).filter(QuestionEvaluation.document_id == document_id, QuestionEvaluation.question_id == question_id).first()
            return [result] if result else []
        except SQLAlchemyError as e:
            print(f"SQLAlchemy Exception: {e}")
        except Exception as e:
            print(f"General Exception: {e}")
    return []        


#Export CSV
def question_evalution_export(db: Session, document_id: str):
    document_id = document_id.upper()
    exiting_evalution = db.query(QuestionEvaluation).filter(QuestionEvaluation.document_id==document_id).first()
    # Use SQL query for performance
    question =f"select * from questions_generation where document_id ='{document_id}'" 
    q_evaluation =f"select * from question_evaluation where document_id ='{document_id}'"
    question_df = pd.read_sql_query(question, con=engine)
    question_evalution_df = pd.read_sql_query(q_evaluation, con=engine)
    # Perform an inner join on 'question_id'
    merged_df = pd.merge(question_df, question_evalution_df, on='question_id', how='inner')
    merged_df = merged_df[['question_id','medical_guideline_body','medical_guideline_type','category','classification_type', 'question','relevancy','relevancy_justification','accuracy','accuracy_justification','clarity','clarity_justification','completeness','completeness_justification','confidence_score','justifications_summary','confidence_level']]
    #change the colum Name
    # merged_df.rename(columns={'medical_guideline_body': 'Medical Guideline'}, inplace=True)
    # Convert DataFrame to CSV in memory
    csv_buffer = io.StringIO()
    merged_df.to_csv(csv_buffer, index=False)
    csv_data = csv_buffer.getvalue()
    if exiting_evalution:
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=question_evaluation_{document_id}.csv"}
            )
    
    return None 


def get_task(db: Session, document_id: str):
    return db.query(QuestionEvaluation).filter(QuestionEvaluation.document_id == document_id).first()

def get_chemos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(QuestionEvaluation).order_by(QuestionEvaluation.document_id).offset(skip).limit(limit).all()

def update_chemo(db: Session, document_id: str, questionEvalution: QuestionEvaluationPost):
    document_id = questionEvalution.document_id
    db_task = db.query(QuestionEvaluation).filter(QuestionEvaluation.document_id == document_id).first()
    if db_task:
        for key, value in QuestionEvaluation.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task