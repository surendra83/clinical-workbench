import os
from fastapi import UploadFile, HTTPException
from app.models.document import Document
from app.database import SessionLocal
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.models.question_model import QuestionGeneration
from app.models.question_evaluation_model import QuestionEvaluation
from app.models.task_tracker import TaskTracker
from app.schemas.question_schema import NewQuestion,QuestionPost
from app.util.cliniciation_process import generateQuestion
from app.config import DOCUMENTS_DIR
import pandas as pd
import numpy as np
from datetime import datetime

def create_question(db: Session, question: QuestionPost):
    doc_id = question.document_id
    document_info = db.query(Document).filter(Document.document_id==doc_id.upper()).first()
     # Check for existing questions
    exitting_question = db.query(QuestionGeneration).filter(QuestionGeneration.document_id==doc_id).all()
    # If existing questions found, delete them
    if document_info:
        file_path = f"{DOCUMENTS_DIR}/{document_info.document_path}"
        if exitting_question:
             # Delete all the question document Related if alredy exit
             # db.query(QuestionGeneration).filter(QuestionGeneration.document_id == doc_id).delete(synchronize_session=False)
            if document_info.document_type == 'MCG':
                
                # step: 2 Update the Status of Trakers
                mytask = db.query(TaskTracker).filter_by(document_id=doc_id).first()
                if mytask:
                    mytask.p_step = 'step_2'
                    db.commit()
                    db.refresh(mytask) 

                return db.query(QuestionGeneration).filter(QuestionGeneration.document_id==doc_id).all()
            
            elif document_info.document_type =='LCG':
                #Call the LCG Related method
                pass
            else:
                pass

        else:
            if document_info.document_type == 'MCG':
                df, evaluation_df= generateQuestion(file_path)
                #Question Persistence
                question_generation_data = [QuestionGeneration(document_id=doc_id, question_id=row['question_id'], medical_guideline_id=row['medical_guideline_id'], medical_guideline_body=row['medical_guideline_body'], medical_guideline_type=row['medical_guideline_type'], question=row['question'],category=row['category'], classification_type=row['classification_type'],generation_time=datetime.utcnow()) for _, row in df.iterrows()]
                db.bulk_save_objects(question_generation_data)
                db.commit()
                #Evalution Question Inserting
                question_evalution = [QuestionEvaluation(document_id=doc_id,
                                                         question_id=row['question_id'],
                                                         relevancy=row['relevancy'],
                                                         relevancy_justification=row['relevancy_justification'],
                                                         accuracy=row['accuracy'],
                                                         accuracy_justification=row['accuracy_justification'],
                                                         clarity=row['clarity'],
                                                         clarity_justification=row['clarity_justification'],
                                                         completeness=row['completeness'],
                                                         completeness_justification=row['completeness_justification'],
                                                         confidence_score=row['confidence_score'],
                                                         justifications_summary=row['justifications_summary'],
                                                         confidence_level=row['confidence_level']) for _, row in evaluation_df.iterrows()]
                
                db.bulk_save_objects(question_evalution)
                db.commit()
                # Update the Status of Trakers
                mytask = db.query(TaskTracker).filter_by(document_id=doc_id).first()
                if mytask:
                    mytask.p_step = 'step_2'
                    db.commit()
                    db.refresh(mytask)
                    
                result_data = db.query(QuestionGeneration).filter(QuestionGeneration.document_id==doc_id).all()
                return result_data
            elif document_info.document_type =='LCG':
                #Call the LCG Related method
                pass
            else:
                pass
    else:
        return db.query(QuestionGeneration).filter(QuestionGeneration.document_id==doc_id).all()  
    
    return None


def new_questionInsert(db: Session, question_param: NewQuestion):  
     #step 1 count last total quesion and add 1 that will be next quesion
     count  = db.query(QuestionGeneration).order_by(QuestionGeneration.document_id==question_param.document_id).count()
     next_id = count + 1
     q_id = f'Q_{next_id}'
     #step 2
     db_question = QuestionGeneration(
                document_id=question_param.document_id,
                question_id=q_id,
                medical_guideline_id='user-entry',
                medical_guideline_body=question_param.medical_guideline_body,
                question=question_param.question,
                medical_guideline_type=question_param.classification_type,
                category=question_param.category,
                classification_type=question_param.classification_type,
                generation_time=datetime.now()
            )
     
     db.add(db_question)
     db.commit()
     db.refresh(db_question)
     return db_question

def get_questions(db: Session, document_id: str):
     document_id = document_id.upper()
     return db.query(QuestionGeneration).filter(QuestionGeneration.document_id == document_id).all()

def get_question_by_id(db: Session, question_id: int):
    return db.query(QuestionGeneration).filter(QuestionGeneration.id == question_id).first()

def delete_question(db: Session, question_id: int):
    question = db.query(QuestionGeneration).filter(QuestionGeneration.id == question_id).first()
    if question:
        db.delete(question)
        db.commit()
    return question
