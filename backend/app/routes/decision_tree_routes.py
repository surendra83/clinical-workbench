from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db

from app.schemas.decision_tree_schema import DecisionTreePost
from app.controllers import decision_tree_controller

router = APIRouter(prefix="/api", tags=["Decision Tree"])

@router.post("/generate-decision-tree",  status_code= status.HTTP_201_CREATED)
def create_taskTracker(post_params: DecisionTreePost, db: Session = Depends(get_db)):
    return decision_tree_controller.generate_decision_tree(db, post_params)


@router.get("/decision-tree",  status_code= status.HTTP_200_OK)
async def find_decision_tree(document_id: str, db: Session = Depends(get_db)):
    return decision_tree_controller.get_decision_tree(db, document_id)


@router.post("/decision-tree",  status_code= status.HTTP_201_CREATED)
async def submit_decision_tree(post_params: DecisionTreePost, db: Session = Depends(get_db)):
    return decision_tree_controller.decision_tree_submit(db, post_params)

@router.get("/decision-export",  status_code= status.HTTP_200_OK)
async def decision_tree_export(document_id: str, db: Session = Depends(get_db)):
    return decision_tree_controller.decision_tree_export(db, document_id)

@router.get("/download-decision-tree",  status_code = status.HTTP_200_OK)
async def download_decision_tree_html(document_id: str, db: Session = Depends(get_db)):
    return decision_tree_controller.decision_tree_html(db, document_id)

@router.get("/download-decision-tree-pdf",  status_code = status.HTTP_200_OK)
async def download_decision_tree_pdf(document_id: str, db: Session = Depends(get_db)):
    return decision_tree_controller.decision_tree_pdf(db, document_id)

