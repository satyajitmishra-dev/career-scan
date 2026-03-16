import numpy as np
import logging

logger = logging.getLogger(__name__)

# In an actual deployment, you might want these to be loaded once at startup.
try:
    from sentence_transformers import SentenceTransformer
    import faiss
    
    _model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    logger.warning(f"Could not load SentenceTransformers or faiss: {e}")
    _model = None
    faiss = None

def calculate_match_score(resume_skills: list, jd_skills: list) -> float:
    """
    Calculates semantic similarity between resume skills and job description skills.
    Returns a score between 0 and 100.
    """
    if not resume_skills or not jd_skills:
        return 0.0
        
    if not _model or not faiss:
        # Fallback to simple set intersection if ML libraries aren't loaded
        set_res = set([s.lower() for s in resume_skills])
        set_jd = set([s.lower() for s in jd_skills])
        intersection = set_res.intersection(set_jd)
        return round((len(intersection) / len(set_jd)) * 100.0, 2)
        
    try:
        # Create embeddings
        resume_text = " ".join(resume_skills)
        jd_text = " ".join(jd_skills)
        
        # Calculate single vector for both to get overall match
        vocab = _model.encode([resume_text, jd_text])
        
        # Normalize vectors for cosine similarity
        faiss.normalize_L2(vocab)
        
        # Simple dot product of normalized vectors = cosine similarity
        similarity = np.dot(vocab[0], vocab[1])
        
        # Convert to percentage
        score = max(0, min(100, float(similarity * 100)))
        return round(score, 2)
    except Exception as e:
        logger.error(f"Error calculating vector match: {e}")
        return 0.0

def find_missing_skills(resume_skills: list, jd_skills: list) -> list:
    """
    Simple exact/substring matching to find missing skills.
    """
    missing = []
    res_lower = " ".join([s.lower() for s in resume_skills])
    
    for jd_skill in jd_skills:
        if jd_skill.lower() not in res_lower:
            missing.append(jd_skill)
            
    return missing
