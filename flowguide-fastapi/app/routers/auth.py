"""
FlowGuide - Auth Router
Register, Login, Refresh, Logout (with refresh_tokens table as blacklist)
"""

import hashlib
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.audit import AuditLog, RefreshToken
from app.models.user import User
from app.schemas.user import (
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _store_refresh_token(db: Session, user: User, refresh_token: str):
    payload = decode_token(refresh_token)
    expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    record = RefreshToken(
        user_id=user.id,
        token_hash=_hash_token(refresh_token),
        is_revoked=False,
        expires_at=expires_at,
    )
    db.add(record)
    db.commit()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        phone_number=payload.phone_number,
        role="user",
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    db.add(AuditLog(user_id=user.id, action="USER_REGISTERED", entity_type="user", entity_id=user.id))
    db.commit()

    try:
        httpx.post(
            f"{settings.SPRING_NOTIFICATION_URL}/welcome",
            json={"email": user.email, "fullName": user.full_name},
            timeout=3.0,
        )
    except Exception:
        pass

    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    access_token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    _store_refresh_token(db, user, refresh_token)

    db.add(AuditLog(user_id=user.id, action="USER_LOGIN", entity_type="user", entity_id=user.id))
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/token", response_model=TokenResponse, include_in_schema=False)
def login_for_swagger(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 password flow endpoint used ONLY by Swagger's 'Authorize' button.
    Accepts form-data (username=email, password=password).
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    access_token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    _store_refresh_token(db, user, refresh_token)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if decoded is None or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    token_hash = _hash_token(payload.refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()

    if record is None or record.is_revoked:
        raise HTTPException(status_code=401, detail="Refresh token revoked or not found")

    if record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token expired")

    user = db.query(User).filter(User.id == record.user_id).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    record.is_revoked = True
    db.commit()

    new_access = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    new_refresh = create_refresh_token({"sub": str(user.id)})
    _store_refresh_token(db, user, new_refresh)

    return TokenResponse(access_token=new_access, refresh_token=new_refresh)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    token_hash = _hash_token(payload.refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()

    if record:
        record.is_revoked = True
        db.add(AuditLog(user_id=record.user_id, action="USER_LOGOUT", entity_type="user", entity_id=record.user_id))
        db.commit()

    return {"status": "logged_out"}