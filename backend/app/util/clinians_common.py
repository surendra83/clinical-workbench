
import json
from app.util.workbench_logger import logger
from multiprocessing import Process, Queue

import time

def to_dict(obj):
    return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}


# Simulated LLM task
def question_process(document_id: str, q: Queue):
    try:
        logger.info(f"LLM processing started for {document_id}")
        time.sleep(15)  # Simulate long-running task
        questions = [f"What is the summary of document {document_id}?",
                     f"List key insights from document {document_id}."]
        q.put(questions)
    except Exception as e:
        q.put(f"Error: {str(e)}")

