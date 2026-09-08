from sqlalchemy import Column, Integer, String, Text, Date, TIMESTAMP, func
from app.database import Base

class TaskTracker(Base):
    __tablename__ = "task_tracker"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpt_code = Column(String(50))
    payer = Column(String(100))
    state = Column(String(50))
    document_id = Column(String(200), nullable=False, unique=True)
    document_type = Column(String(200))
    document_title = Column(Text)
    due_date = Column(Date)
    priority = Column(String(20))
    status = Column(String(50))
    p_step = Column(String(20), server_default='initial')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

