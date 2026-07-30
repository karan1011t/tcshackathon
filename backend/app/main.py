from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.evaluate import router as evaluate_router
from app.api.policies import router as policy_router

app = FastAPI(
    title="Sentinel AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    evaluate_router,
    prefix="/api/v1",
    tags=["Evaluation"]
)

app.include_router(
    policy_router,
    prefix="/api/v1/policies",
    tags=["Policies"]
)


@app.get("/")
def home():

    return {
        "project": "Sentinel AI",
        "status": "Running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }