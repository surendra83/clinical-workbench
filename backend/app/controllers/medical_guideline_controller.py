
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.medical_guideline import MedicalGuideline
from app.schemas.medical_guideline_schema import MedicalGuidelineCreate, MedicalGuidelineExtract
from app.models.document import Document
from app.util.cliniciation_process import ExtractMedicalGuideLine
from fastapi.responses import JSONResponse
from datetime import datetime
from app.config import DOCUMENTS_DIR
from app.database import engine
import pandas as pd
import numpy as np
import json
import io

def to_dict(obj):
    return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}


def get_guideline_by_id(db: Session, doc_id: str):
    doc_id = doc_id.upper()
    #Step 1 : Getting File File From Document Table
    results = db.query(MedicalGuideline).filter(MedicalGuideline.document_id==doc_id).all()
    # Print or process the records
    # for record in results:
    #     print(json.dumps(to_dict(record), indent=4, default=str))
    return results


def extract_medicalGuideline(db: Session, medical_extract: MedicalGuidelineExtract):
    document_id = medical_extract['document_id'].upper()
    #Step 1 : Getting File File From Document Table
    document = db.query(Document).filter(Document.document_id==document_id).first()
    already_exists_medical_guideline = db.query(MedicalGuideline).filter(MedicalGuideline.document_id==document_id).first()
    # stpe 2: checked the condtion and call the AI Model 
    if document:
        file_path = f"{DOCUMENTS_DIR}/{document.document_path}"
        if not already_exists_medical_guideline:
            #step 3: Calling AI Model
            try : 
                df = ExtractMedicalGuideLine(file_path)
                # Step 4: Convert DataFrame rows to MedicalGuideline objects insertting to db
                medical_guideline_data = [MedicalGuideline(document_id=document_id, medical_guideline_id=row['medical_guideline_id'], medical_guideline_body=row['medical_guideline_body'], medical_guideline_type=row['medical_guideline_type'], category=row['category'],classification_type=row['classification_type'],extraction_time=datetime.utcnow()) for _, row in df.iterrows()]
                db.bulk_save_objects(medical_guideline_data)
                db.commit()
                #db.refresh(medical_guideline_data)
                #print("Inserted: Count:", db.query(MedicalGuideline).count())
                inserted_data = db.query(MedicalGuideline).filter(MedicalGuideline.document_id==document_id).all()
               
                return inserted_data 
            
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
        else:
            result_dataset = db.query(MedicalGuideline).filter(MedicalGuideline.document_id==document_id).all()
            return result_dataset
        
    return None
   
     
def medical_guideline_export_csv(document_id: str, db: Session):
    TABLE_NAME = 'medical_guidelines'
    # Use SQL query for performance
    query = f"select medical_guideline_body, medical_guideline_type, category, classification_type, extraction_time from medical_guidelines where document_id='{document_id}'"
    medical_guideline_df = pd.read_sql_query(query, con=engine)

    #change the colum Name
    medical_guideline_df.rename(columns={'medical_guideline_body': 'Medical Guideline'}, inplace=True)
    medical_guideline_df.rename(columns={'medical_guideline_type': 'Medical Guideline Type'}, inplace=True)
    medical_guideline_df.rename(columns={'category': 'Category'}, inplace=True)
    medical_guideline_df.rename(columns={'classification_type': 'Classification Type'}, inplace=True)
    medical_guideline_df.rename(columns={'extraction_time': 'Extraction Time'}, inplace=True)

    # Convert DataFrame to CSV in memory
    csv_buffer = io.StringIO()
    medical_guideline_df.to_csv(csv_buffer, index=False)
    csv_data = csv_buffer.getvalue()
    return csv_data    
