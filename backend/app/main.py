from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

from app.routes import task_tracker
from app.routes import medical_guideline
from app.routes import document_routes
from app.routes import question_routes
from app.routes import question_evaluation_routes
from app.routes import decision_tree_routes

from app.models.document import Document
from app.models.medical_guideline import MedicalGuideline
from app.models.question_model import QuestionGeneration
from app.models.question_evaluation_model import QuestionEvaluation
from app.models.decision_tree_model import DecisionTree

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Clinicians Workbench API",
    description="This is a custom description for my API.",
    swagger_favicon_url="/static/favicon.ico")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000", # React prod server
    "http://localhost:5173", # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

# Module Spefice Routes
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(task_tracker.router)
app.include_router(medical_guideline.router)
app.include_router(document_routes.router)
app.include_router(question_routes.router)
app.include_router(question_evaluation_routes.router)
app.include_router(decision_tree_routes.router)