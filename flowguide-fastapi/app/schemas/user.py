"""
FlowGuide - User & Auth Schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ---- Auth ----
class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=6, max_length=72)
    phone_number: Optional[str] = Field(default=None, max_length=50)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


# ---- User Profile ----
class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    phone_number: Optional[str] = None
    interests: Optional[str] = ""
    skill_level: Optional[str] = "Beginner"
    streak_count: int = 0
    total_points: int = 0
    daily_target_minutes: int = 30
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    avatar_url: Optional[str] = None
    phone_number: Optional[str] = Field(default=None, max_length=50)
    interests: Optional[str] = None
    skill_level: Optional[str] = None
    daily_target_minutes: Optional[int] = None