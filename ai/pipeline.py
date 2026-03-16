import logging
from .parsing.pdf_parser import extract_text_from_pdf
from .parsing.text_cleaner import clean_extracted_text
from .nlp.entity_extractor import extract_skills_heuristic
from .matching.jd_matcher import calculate_match_score, find_missing_skills
from .llm.llama_analysis import analyze_resume_with_llm

logger = logging.getLogger(__name__)

async def run_ai_pipeline(pdf_bytes: bytes, job_description: str = None) -> dict:
    """
    Orchestrates the complete AI Resume Analyzer pipeline.
    
    Args:
        pdf_bytes (bytes): The raw bytes of the resume PDF.
        job_description (str, optional): The job description to match against.
        
    Returns:
        dict: A dictionary containing scores, skills, and suggestions.
    """
    logger.info("Starting AI pipeline execution")
    
    try:
        # 1. Parsing & Cleaning
        raw_text = extract_text_from_pdf(pdf_bytes)
        cleaned_text = clean_extracted_text(raw_text)
        
        if not cleaned_text:
            logger.warning("Pipeline aborted: No text could be extracted from the PDF.")
            return {"error": "Failed to extract text from PDF"}
            
        # 2. Extract entities/skills (Heuristic-based)
        logger.info("Extracting skills via heuristics")
        resume_skills = extract_skills_heuristic(cleaned_text)
        jd_skills = []
        
        match_score = None
        heuristic_missing_skills = []
        
        if job_description:
            jd_skills = extract_skills_heuristic(job_description)
            match_score = calculate_match_score(resume_skills, jd_skills)
            heuristic_missing_skills = find_missing_skills(resume_skills, jd_skills)
            
        # 3. LLM Deep Analysis
        logger.info("Starting deep analysis with LLM")
        llm_analysis = await analyze_resume_with_llm(cleaned_text, job_description)
        
        # Merge results from both heuristic and LLM analysis
        llm_missing = llm_analysis.get('missing_skills', [])
        final_missing = list(set(llm_missing + heuristic_missing_skills))
        
        # Determine final score (Prefer LLM score if available, otherwise heuristic match)
        final_score = llm_analysis.get('score', match_score or 0)
        
        return {
            "status": "success",
            "resume_score": final_score,
            "job_match_score": match_score,
            "extracted_skills": resume_skills,
            "missing_skills": final_missing,
            "suggestions": llm_analysis.get('suggestions', [])
        }
    except Exception as e:
        logger.error(f"Critical error in AI pipeline: {e}", exc_info=True)
        return {"error": f"An internal error occurred during processing: {str(e)}"}
