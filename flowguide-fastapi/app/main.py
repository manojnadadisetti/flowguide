"""
FlowGuide - FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal, connect_to_mongo, close_mongo_connection, ping_mongo
from app.core.db_patch import patch_and_seed_db
from app.routers import auth, onboarding, users, courses, quizzes, assignments, chatbot, planner, resources

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Patch and seed databases
with SessionLocal() as db:
    patch_and_seed_db(db)


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    description="FlowGuide - Student Learning & Onboarding API",
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
app.include_router(courses.router)
app.include_router(quizzes.router)
app.include_router(assignments.router)
app.include_router(chatbot.router)
app.include_router(planner.router)
app.include_router(resources.router)


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