import httpx
import json
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
TARGET_MODEL = "llama3" # or whatever is available locally e.g. llama3:8b

async def analyze_resume_with_llm(resume_text: str, jd_text: str = None) -> Dict[str, Any]:
    """
    Calls a local Ollama instance running Llama 3 to analyze the resume.
    """
    
    prompt = f"""
    You are an expert technical recruiter and ATS software analyzer.
    Analyze the following resume text.
    {"Also compare it against the provided Job Description." if jd_text else ""}
    
    RESUME:
    {resume_text[:2000]} # Truncated for token limit in simple example
    
    {"JOB DESCRIPTION: " + jd_text[:1000] if jd_text else ""}
    
    Provide your output STRICTLY in the following JSON format without any markdown blocks or additional text:
    {{
        "score": <overall score from 0-100 indicating resume quality>,
        "missing_skills": ["skill1", "skill2"],
        "suggestions": ["suggestion 1", "suggestion 2"]
    }}
    """
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": TARGET_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            # The response from Ollama should be pure JSON based on our prompt
            result = json.loads(data.get("response", "{}"))
            return {
                "score": result.get("score", 50),
                "missing_skills": result.get("missing_skills", []),
                "suggestions": result.get("suggestions", ["Add more quantifiable achievements."])
            }
            
    except Exception as e:
        logger.error(f"Error calling LLM APIs: {e}")
        # Return fallback mock data
        return {
            "score": 65,
            "missing_skills": ["Unable to analyze properly via LLM"],
            "suggestions": ["Service unavailable. Fallback default suggestion."]
        }
