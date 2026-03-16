# AI Resume Analyzer

A powerful tool to parse, analyze, and score resumes against job descriptions using AI.

## Project Structure

- **ai/**: Core AI logic, including LLM integration (Ollama/Llama 3), NLP heuristics, and PDF parsing.
- **backend/**: FastAPI application providing the REST API.
- **workers/**: Background tasks for processing resumes asynchronously.
- **frontend/**: React-based user interface (Vite/Tailwind).

## Key Features

- **Multi-stage Parsing**: Uses `pdfplumber` and `PyPDF2` for robust text extraction.
- **Skill Extraction**: Combines heuristic-based NLP with LLM-powered deep analysis.
- **Scoring & Suggestions**: Provides an overall match score and actionable improvement tips.
- **Async Processing**: Resumes are processed in the background to ensure a responsive UI.

## Local Setup

### Prerequisites

- Python 3.9+
- Node.js & npm
- MongoDB
- [Ollama](https://ollama.com/) (running Llama 3)
- Cloudflare R2 (optional, fallbacks to local storage)

### Backend

1.  Create a virtual environment: `python -m venv .venv`
2.  Install dependencies: `pip install -r requirements.txt`
3.  Set up environment variables in `.env` (use `.env.example` as a template).
4.  Run the server: `uvicorn backend.app.main:app --reload`

### Frontend

1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`

## License

MIT
