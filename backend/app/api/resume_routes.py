import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from app.config.database import get_database
from workers.tasks import process_resume_task

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    experience_level: str = Form(...),
    job_description: str = Form(None)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_content = await file.read()
    task_id = str(uuid.uuid4())
    db = get_database()
    
    # Create initial resume record in DB
    resume_doc = {
        "_id": task_id,
        "filename": file.filename,
        "experience_level": experience_level,
        "job_description_provided": bool(job_description),
        "status": "pending",
        "created_at": datetime.utcnow(),
        "user_id": "guest" # Hardcoded for now without auth dependency
    }
    
    await db["resumes"].insert_one(resume_doc)

    # Trigger background task
    background_tasks.add_task(
        process_resume_task,
        task_id=task_id,
        file_content=file_content,
        filename=file.filename,
        experience_level=experience_level,
        job_description=job_description
    )
    
    return {
        "message": "Resume uploaded and processing started", 
        "task_id": task_id,
        "status": "pending"
    }

@router.get("/status/{task_id}")
async def get_processing_status(task_id: str):
    db = get_database()
    resume = await db["resumes"].find_one({"_id": task_id})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Task not found")
        
    response = {
        "task_id": task_id, 
        "status": resume.get("status")
    }
    if resume.get("status") == "failed":
        response["error"] = resume.get("error_message")
        
    return response
