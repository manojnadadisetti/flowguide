"""
FlowGuide - FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, connect_to_mongo, close_mongo_connection, ping_mongo
from app.routers import auth, onboarding, users

# Create tables if they don't exist (Spring Boot already creates them,
# but this ensures FastAPI's models match — safe no-op if tables exist)
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    description="FlowGuide - User Onboarding & Guided Workflow API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allow React frontend + Spring Boot
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # React frontend
        "http://localhost:8080",   # Spring Boot
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "UP", "service": "FlowGuide FastAPI"}


@app.get("/api/health/mongo")
async def mongo_health():
    connected = await ping_mongo()
    return {"mongodb_connected": connected}