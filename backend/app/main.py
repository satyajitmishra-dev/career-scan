from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_routes import router as auth_router
from app.api.resume_routes import router as resume_router
from app.api.analysis_routes import router as analysis_router
from app.config.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="AI Resume Analyzer API",
    description="API for parsing, analyzing, and scoring resumes against job descriptions.",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database event handlers
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(resume_router, prefix="/api/v1/resumes", tags=["Resumes"])
app.include_router(analysis_router, prefix="/api/v1/analysis", tags=["Analysis"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Resume Analyzer API. API is running."}
