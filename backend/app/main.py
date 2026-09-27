from fastapi import FastAPI

from app.api.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Movie Analytics API",
    description="Backend for Movie Analytics project",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "Movie Analytics API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }