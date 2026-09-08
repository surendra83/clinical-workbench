import os
from fastapi import Response
from sqlalchemy.orm import Session
from app.models.decision_tree_model import DecisionTree
from app.models.document import Document
from app.models.task_tracker import TaskTracker
from app.schemas.decision_tree_schema import DecisionTreePost
from app.util.cliniciation_process import decision_tree_extraction, add_criteria_to_dession_tree
from app.util.desstion_tree import df_to_hierarchical_json
import pandas as pd
import numpy as np
from app.config import DOCUMENTS_DIR
from fastapi.responses import JSONResponse
from weasyprint import HTML
import json
from fastapi.responses import StreamingResponse
import io
from app.config import DATA_DIR
from app.util.decision_tree_html import css_styles, html_convert

def generate_decision_tree(db: Session, params: DecisionTreePost):
    document_id = params.document_id.upper()
    find_document = db.query(Document).filter(Document.document_id==document_id).first()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if find_document:
         file_path = f"{DOCUMENTS_DIR}/{find_document.document_path}"
         #check if document tree has already generate data in database
         if exitting_decision_tree is None:
            dession_tree_df = decision_tree_extraction(file_path)
            #Setp 2 Question Persistence
            decision_tree_obj = [DecisionTree(document_id=document_id, medical_guideline_id=row['member_id'], logical_relation=row['logical_relation'], medical_guideline_body=row['content'], question=row['question'], category=row['category'], classification_type=row['classification_type'],decision_tree_context=f'{document_id}_data.json' ) for _, row in dession_tree_df.iterrows()]
            db.bulk_save_objects(decision_tree_obj)
            db.commit()
            df = dession_tree_df
            decision_tree_json = df_to_hierarchical_json(
                df,
                id_col='member_id',
                relation_col='logical_relation',
                content_col='content',
                question_col='question',
                classification_type_col='classification_type',
                category_col='category',
                seq_col=None,           
                include_seq=True,
                return_single_root=False,
                create_missing_parents=False,
                hide_empty_children=True  
            )
            # step 3 add LLM Add Criteria
            decision_tree_final_json= add_criteria_to_dession_tree(decision_tree_json)
            #step 4 json file 
            json_file_name =f"{DATA_DIR}/{document_id}_data.json"           
            with open(json_file_name, 'w', encoding='utf-8') as f:
                json.dump(decision_tree_final_json, f, ensure_ascii=False, indent=4)

            #Step 5 chante Traker Status
            mytask = db.query(TaskTracker).filter_by(document_id=document_id).first()
            if mytask:
                mytask.p_step = 'step_3'
                mytask.status = 'Complete'
                db.commit()
                db.refresh(mytask)
            return JSONResponse(content=[{'Content':"Sucessfull Data generated"}])
         else:
            # exiting_document_decision_tree = transform_json(dession_tree_df)
            json_file_name =f"{DATA_DIR}/{document_id}_data.json"
            try:
                 with open(json_file_name, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return JSONResponse(content=data)
                       
            except Exception as e:
                    return JSONResponse(content={"error": str(e)}, status_code=500)
             
    return None


def get_decision_tree(db: Session,document_id:str):
    document_id = document_id.upper()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if exitting_decision_tree:     
        json_file_name =f"{DATA_DIR}/{document_id}_data.json"
        try:
            with open(json_file_name, "r", encoding="utf-8") as f:
                data = json.load(f)
                return JSONResponse(content=data)
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)
        
    return None


def decision_tree_submit(db: Session, params: DecisionTreePost):
    document_id = params.document_id.upper()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if exitting_decision_tree:
        mytask = db.query(TaskTracker).filter_by(document_id=document_id).first()
        if mytask:
            mytask.status = 'Complete'
            db.commit()
            db.refresh(mytask)
        return JSONResponse(content={'Message':"Successfully submited"}, status_code=200) 
    return None         


def decision_tree_export(db: Session, document_id: str):
    document_id = document_id.upper()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if exitting_decision_tree:     
        json_file_name =f"{DATA_DIR}/{document_id}_data.json"
        try:
            with open(json_file_name, "r", encoding="utf-8") as f:
                data_json = json.load(f)
                
            # Convert JSON to string
            json_str = json.dumps(data_json, indent=2)
            # Return as downloadable response
            return Response(
                    content=json_str,
                    media_type="application/json",
                    headers={"Content-Disposition": f"attachment; filename=export_{document_id}.json"}
                )
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)
 
    return None


# Download HTML Reports 
def decision_tree_html(db: Session, document_id: str):
    document_id = document_id.upper()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if exitting_decision_tree:
        document = db.query(Document).filter(Document.document_id==document_id).first()
        json_file_name =f"{DATA_DIR}/{document_id}_data.json"
        try:
            with open(json_file_name, "r", encoding="utf-8") as f:
                data_json = json.load(f)

            # HTML Structuring
            html_body = html_convert(data_json)
            full_html = f"<!DOCTYPE html><html><head>{css_styles}</head><body><h1>{document.document_title}</h1>{html_body}</body></html>"
 
            # Save HTML to file into runtime memory
            html_stream = io.BytesIO(full_html.encode("utf-8"))
            # Return as downloadable response
            return StreamingResponse(
                    html_stream,
                    media_type="text/html",
                    headers={"Content-Disposition": f"attachment; filename={document.document_title}_output.html"}
                )
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)

    return None


# Download pdf Reports 
def decision_tree_pdf(db: Session, document_id: str):
    document_id = document_id.upper()
    exitting_decision_tree = db.query(DecisionTree).filter(DecisionTree.document_id==document_id).first()
    if exitting_decision_tree:
        document = db.query(Document).filter(Document.document_id==document_id).first()
        json_file_name =f"{DATA_DIR}/{document_id}_data.json"
        try:
            with open(json_file_name, "r", encoding="utf-8") as f:
                data_json = json.load(f)

            # HTML Structuring
            html_body = html_convert(data_json)
            full_html = f"<!DOCTYPE html><html><head>{css_styles}</head><body><h1>{document.document_title}</h1>{html_body}</body></html>"
 
            #Save pdf to file into runtime memory
            pdf_stream = io.BytesIO()
            HTML(string=full_html).write_pdf(pdf_stream)
            pdf_stream.seek(0)
            # Return as downloadable response
            return StreamingResponse(
                    pdf_stream,
                    media_type="application/pdf", 
                    headers={"Content-Disposition": f"attachment; filename={document.document_title}_output.pdf"}
                )
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)

    return None
