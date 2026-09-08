
from fastapi import APIRouter, Depends,Form, HTTPException, status, UploadFile, File, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from app.core.dependencies import get_db
from app.schemas.document_schema import DocumentOut
from app.controllers import document_controller 

router = APIRouter(prefix="/api", tags=["Documents"])

@router.post("/document-upload", status_code=status.HTTP_201_CREATED, summary="Upload documents")
async def upload_document(file: UploadFile = File(...), cpt_code: str = Form(...), document_id: str = Form(...), document_type: str = Form(...), document_title: str = Form(...),document_source: str = Form(...), db: Session = Depends(get_db)):
    """
      Handles multipart/form-data file upload.
    """
    try:
        document = document_controller.create_document(file, cpt_code, document_id, document_type, document_title, document_source, db)
        return JSONResponse(content={'file': document, 'status_code':status.HTTP_201_CREATED} )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/document/{doc_id}", response_model=DocumentOut, status_code=status.HTTP_200_OK)
async def find_document(doc_id: str, db: Session = Depends(get_db)):
    db_document = document_controller.get_document(db, doc_id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_document 