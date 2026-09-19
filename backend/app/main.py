from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.models  # Register all SQLAlchemy models on Base.metadata
from app.api.v1.auth import router as auth_router
from app.api.v1.scenarios import router as scenarios_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.performance import router as performance_router
from app.api.v1.profile import router as profile_router
from app.api.v1.ml import router as ml_router
from app.core.config import settings
from app.db.session import Base, engine, SessionLocal
from app.db.seed_scenarios import seed_scenarios

# Ensure database tables are created on startup
Base.metadata.create_all(bind=engine)

# Seed scenario catalog
with SessionLocal() as db:
    seed_scenarios(db)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Smart Adaptive Learning Adventure Backend APIs",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(scenarios_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(performance_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(ml_router, prefix=settings.API_V1_STR)



@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "GameLearn AI Backend"}

