import os
from fastapi import UploadFile, HTTPException
from app.models.document import Document
from app.database import SessionLocal
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.task_tracker import TaskTracker
from app.util.cliniciation_process import fetch_MCG
from app.config import DOCUMENTS_DIR
from app.schemas.document_schema import DocumentCreate, DocumentUpdate


ALLOWED_EXTENSIONS = {".html", ".xlsx",".xls"}

def create_document(file: UploadFile,cpt_code: str, document_id:str, document_type: str, document_title: str, document_source: str, db: Session):
    # Step1: Document_ID Preparation
    document_id= document_id.upper()
    exitting_document = db.query(Document).filter(Document.document_id==document_id).first()
    #Step 2: Cheking the File Extention
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")
    #step:3 get file path and saving server
    path=save_file(file)

    if exitting_document:
        exitting_document.document_path=file.filename
        db.commit()
        db.refresh(exitting_document)
        pass
    else :
        # Step 4: Create the Document record
        new_document = Document(
            document_id=document_id,
            cpt_code=cpt_code,
            document_type=document_type,
            document_title=document_title,
            retrieval_time= datetime.utcnow(),
            document_source=document_source,
            document_path=file.filename
        )
        # Step 6: Add and commit to Persist on DB
        db.add(new_document)
        db.commit()
        db.refresh(new_document)
        pass

    #step:6 check AI Geneated Context
    file_location = f"{DOCUMENTS_DIR}/{file.filename}"
    if document_type.upper() == "MCG":
        MCG, MCG_title, MCG_ID = fetch_MCG(file_location)
        print("::",MCG_title, MCG_ID, document_type.upper())
    elif document_type.upper() == "LCD":
        pass
    # step: 7 Update the Status of Trakers
    mytask = db.query(TaskTracker).filter_by(document_id=document_id).first()
    if mytask:
        mytask.status =  'In Progress'
        mytask.p_step = 'step_1'
        db.commit()
        db.refresh(mytask)

    return path


def get_document(db: Session, document_id: str):
    return db.query(Document).filter(Document.document_id == document_id).first()

    
# Save the file in disk
def save_file(file: UploadFile) -> str:
    os.makedirs(DOCUMENTS_DIR, exist_ok=True)
    file_location = os.path.join(DOCUMENTS_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    return file_location
