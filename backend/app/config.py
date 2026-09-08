import os
from dotenv import load_dotenv
load_dotenv()

DB_USER=os.getenv("DB_USER")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_HOST=os.getenv("DB_HOST")
DB_NAME=os.getenv("DB_NAME")
PORT=os.getenv("DB_PORT")

DATABASE_URL =f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{PORT}/{DB_NAME}"

DOCUMENTS_DIR = "app/documents"

DATA_DIR = "app/documents/data"