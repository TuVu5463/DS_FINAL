from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Return a lightweight health response for local development checks."""
    return {"status": "ok", "message": "FastAPI backend is running."}
