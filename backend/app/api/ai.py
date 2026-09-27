from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_movie_description


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


class MovieDescriptionRequest(BaseModel):
    description: str


class MovieDescriptionResponse(BaseModel):
    description: str


@router.post(
    "/movie-description",
    response_model=MovieDescriptionResponse,
)
def generate_description(
    request: MovieDescriptionRequest,
):
    if not request.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Описание фильма не может быть пустым",
        )

    try:
        description = generate_movie_description(
            request.description
        )

        return {
            "description": description
        }

    except Exception as error:
        print(f"AI error type: {type(error).__name__}")
        print(f"AI error: {error}")

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )