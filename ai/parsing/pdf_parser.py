import pdfplumber
import PyPDF2
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file buffer using pdfplumber primarily, 
    with a fallback to PyPDF2.
    """
    text = ""
    try:
        # Primary extraction using pdfplumber (better for complex layouts)
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
                    
        # Fallback to PyPDF2 if pdfplumber fails or extracts nothing
        if not text.strip():
            logger.info("pdfplumber extracted no text, falling back to PyPDF2")
            reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
                    
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""
