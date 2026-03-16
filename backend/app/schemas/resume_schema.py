from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    experience_level: str
    job_description: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    file_url: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalysisResult(BaseModel):
    resume_id: str
    score: int
    missing_skills: List[str]
    suggestions: List[str]
    job_match_score: Optional[int] = None
