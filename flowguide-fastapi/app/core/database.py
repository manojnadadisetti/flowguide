"""
FlowGuide - Database Connection
SQLAlchemy engine + session setup using psycopg2 (sync driver)
Connects to the SAME PostgreSQL database that Spring Boot created tables in.
Also sets up a MongoDB (Atlas) client used alongside Postgres for new features.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=5,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- MongoDB (Atlas) ----------------

mongo_client: AsyncIOMotorClient | None = None


def connect_to_mongo() -> None:
    """Create the Mongo client. Called once on app startup."""
    global mongo_client
    if not settings.MONGODB_URI:
        print("MONGODB_URI not set - skipping MongoDB connection")
        return
    mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)


def close_mongo_connection() -> None:
    """Close the Mongo client. Called once on app shutdown."""
    global mongo_client
    if mongo_client is not None:
        mongo_client.close()
        mongo_client = None


def get_mongo_db():
    """Return the configured MongoDB database, or raise if not connected."""
    if mongo_client is None:
        raise RuntimeError("MongoDB is not connected. Check MONGODB_URI in your .env file.")
    return mongo_client[settings.MONGODB_DB_NAME]


async def ping_mongo() -> bool:
    """Return True if MongoDB responds to a ping, False otherwise."""
    if mongo_client is None:
        return False
    try:
        await mongo_client.admin.command("ping")
        return True
    except Exception:
        return False