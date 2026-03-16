import re

def clean_extracted_text(text: str) -> str:
    """
    Cleans raw text extracted from PDFs.
    Removes unusual characters, fixes spacing, and strips unnecessary whitespace.
    """
    if not text:
        return ""
        
    # Replace non-breaking spaces
    text = text.replace('\xa0', ' ')
    
    # Remove multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special unicode characters that often appear in resume formatting
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    
    # Trim and return
    return text.strip()
