"""
FlowGuide - Application Configuration
Loads settings from .env file using pydantic-settings
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # App
    APP_NAME: str = "FlowGuide API"
    APP_PORT: int = 8000

    # Spring Boot notification service
    SPRING_NOTIFICATION_URL: str = "http://localhost:8080/notifications"

    # MongoDB (Atlas) - used alongside PostgreSQL for new features
    MONGODB_URI: str = ""
    MONGODB_DB_NAME: str = "flowguide"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()