import asyncio
import logging
import uuid
from datetime import datetime
from app.config.database import get_database
from app.utils.file_handler import file_handler
from ai.pipeline import run_ai_pipeline

logger = logging.getLogger(__name__)

async def process_resume_task(task_id: str, file_content: bytes, filename: str, experience_level: str, job_description: str = None, user_id: str = "guest"):
    """
    Background task to orchestrate the AI analysis pipeline.
    """
    db = get_database()
    try:
        logger.info(f"Starting background processing for task {task_id}")
        
        # 1. Update database: status='processing'
        await db["resumes"].update_one(
            {"_id": task_id},
            {"$set": {"status": "processing", "updated_at": datetime.utcnow()}}
        )
        
        # 2. Upload file to R2 / Local storage
        file_url = await file_handler.upload_file(file_content, filename)
        
        # 3. Run AI Pipeline
        ai_results = await run_ai_pipeline(file_content, job_description)
        
        if "error" in ai_results:
            raise Exception(ai_results["error"])
        
        # 4. Save analysis results separately or embed them
        analysis_doc = {
            "resume_id": task_id,
            "score": ai_results["resume_score"],
            "missing_skills": ai_results["missing_skills"],
            "suggestions": ai_results["suggestions"],
            "job_match_score": ai_results["job_match_score"],
            "extracted_skills": ai_results["extracted_skills"],
            "created_at": datetime.utcnow()
        }
        await db["analyses"].insert_one(analysis_doc)
        
        # 5. Update database: status='completed', save analysis results link
        await db["resumes"].update_one(
            {"_id": task_id},
            {"$set": {
                "status": "completed", 
                "file_url": file_url,
                "score": ai_results["resume_score"],
                "updated_at": datetime.utcnow()
            }}
        )
        
        logger.info(f"Successfully finished processing task {task_id}")
        
    except Exception as e:
        logger.error(f"Error processing resume {task_id}: {e}")
        # Update database: status='failed'
        if db is not None:
             await db["resumes"].update_one(
                {"_id": task_id},
                {"$set": {"status": "failed", "error_message": str(e), "updated_at": datetime.utcnow()}}
            )
