from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.health import router as health_router

app = FastAPI(
    title="AFC Asian Cup 2027 Predictor API",
    description=(
        "API for football match predictions, scoreline probabilities, "
        "team analytics, and tournament simulations."
    ),
    version="0.1.0",
)

# Local development origins. Restrict these to the deployed frontend domain later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    return {
        "name": "AFC Asian Cup 2027 Predictor API",
        "docs": "/docs",
        "health": "/api/health",
    }
