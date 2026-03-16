from fastapi import APIRouter, HTTPException
from app.config.database import get_database

router = APIRouter()

@router.get("/{resume_id}")
async def get_analysis_result(resume_id: str):
    db = get_database()
    
    # Check if resume processing is still running
    resume = await db["resumes"].find_one({"_id": resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if resume.get("status") != "completed":
        return {
            "status": resume.get("status"),
            "message": "Analysis is not completed yet."
        }
        
    # Fetch final analysis
    analysis = await db["analyses"].find_one({"resume_id": resume_id})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis results not found")
        
    return {
        "resume_id": resume_id,
        "status": "completed",
        "score": analysis.get("score"),
        "missing_skills": analysis.get("missing_skills", []),
        "extracted_skills": analysis.get("extracted_skills", []),
        "suggestions": analysis.get("suggestions", []),
        "job_match": analysis.get("job_match_score")
    }
