import spacy
import logging

logger = logging.getLogger(__name__)

# Try to load the spacy model safely. (Would require python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("Spacy model 'en_core_web_sm' not found. It needs to be downloaded.")
    nlp = None

def extract_entities(text: str) -> dict:
    """
    Basic Named Entity Recognition to find potential sections like 
    organizations, degree-like structures, and skills.
    Note: For a production app, a specialized NER model or LLM does this better.
    """
    if not nlp:
        return {"organizations": [], "persons": [], "raw_text": text}
        
    doc = nlp(text)
    
    orgs = list(set([ent.text for ent in doc.ents if ent.label_ == 'ORG']))
    persons = list(set([ent.text for ent in doc.ents if ent.label_ == 'PERSON']))
    
    return {
        "organizations": orgs,
        "persons": persons
    }

def extract_skills_heuristic(text: str) -> list:
    """
    Simple heuristic approach to find common tech skills.
    In a real scenario, this relies on a vast taxonomy or LLM parsing.
    """
    common_skills = [
        "python", "java", "c++", "react", "node.js", "docker", "kubernetes", 
        "aws", "gcp", "azure", "sql", "mongodb", "fastapi", "machine learning",
        "deep learning", "nlp", "html", "css", "javascript", "typescript"
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in common_skills:
        # Use regex border to avoid matching substrings like "react" inside "reactor"
        if f' {skill} ' in text_lower or text_lower.startswith(f'{skill} '):
            found_skills.append(skill.upper() if len(skill) <= 3 else skill.title())
            
    return list(set(found_skills))
