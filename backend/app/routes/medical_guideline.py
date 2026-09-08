
from fastapi import APIRouter, Depends, HTTPException, status,Response
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from typing import List
from fastapi.responses import JSONResponse

from app.controllers import medical_guideline_controller

from app.schemas.medical_guideline_schema import MedicalGuidelineCreate,MedicalGuidelineResponse,MedicalGuidelineExtract


router = APIRouter(prefix="/api", tags=["Medical Guidelines"])

@router.post("/medical-guideline-extract",response_model=List[MedicalGuidelineResponse], status_code= status.HTTP_201_CREATED)
def extact_medical_guideline(extract_guideline: MedicalGuidelineExtract, db: Session = Depends(get_db)):
     return medical_guideline_controller.extract_medicalGuideline(db, extract_guideline.dict())
    
    
@router.get("/extracted-guideline/{doc_id}", response_model=List[MedicalGuidelineResponse])
async def read_guideline(doc_id: str, db: Session = Depends(get_db)):
    db_guideline = medical_guideline_controller.get_guideline_by_id(db, doc_id)
    if db_guideline is None:
        raise HTTPException(status_code=404, detail="Guideline not found")
    return db_guideline


#Export CSV or Downlod CSV Files
@router.get('/medical-guideline-export-csv', status_code=status.HTTP_200_OK)
async def export_csv(document_id: str, db: Session = Depends(get_db)):
    document_id = document_id.upper()
    csv_data = medical_guideline_controller.medical_guideline_export_csv(document_id, db)
    #Return CSV as downloadable file
    fname ='medical_guideline'
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={fname}.csv"}
    )   

