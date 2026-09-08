
from fastapi import APIRouter, WebSocket
import pandas as pd
import numpy as np
from multiprocessing import Process, Queue
from app.util.clinians_common import question_process

import time


router = APIRouter()

@router.websocket("/ws/quesiotns/{document_id}")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    await websocket.accept()
    await websocket.send_text(f"WebSocket started for document_id: {document_id}")
    await websocket.send_text("Processing...")
    await websocket.close()

@router.websocket("/ws/{document_id}")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    await websocket.accept()
    await websocket.send_text(f"Started processing document_id: {document_id}")

    q = Queue()
    p = Process(target=question_process, args=(document_id, q))
    p.start()

    timeout = 10  # seconds
    start_time = time.time()

    while True:
        if not p.is_alive():
            break

        elapsed = time.time() - start_time
        if elapsed > timeout:
            p.terminate()
            await websocket.send_text("Process timed out and was terminated.")
            await websocket.close()
            return

        await websocket.send_text("Still working...")
        time.sleep(1)

    if not q.empty():
        result = q.get()
        await websocket.send_text(f"Questions generated: {result}")
    else:
        await websocket.send_text("No result returned from process.")

    await websocket.close()
