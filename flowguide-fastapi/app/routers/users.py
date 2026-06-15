"""
FlowGuide - User Profile Router (Proxied to Spring Boot Backend)
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
import httpx

from app.core.deps import get_current_user, oauth2_scheme
from app.models.user import User
from app.schemas.user import UserOut, UserUpdateRequest

router = APIRouter(prefix="/api/users", tags=["Users"])

SPRING_BOOT_URL = "http://localhost:8080/api/users"
SPRING_BOOT_AUDIT_URL = "http://localhost:8080/api/audit-logs"

def format_datetime(val):
    if isinstance(val, list):
        try:
            parts = [str(x).zfill(2) for x in val]
            # Format: YYYY-MM-DDTHH:MM:SS
            date_str = f"{parts[0]}-{parts[1]}-{parts[2]}T{parts[3]}:{parts[4]}:{parts[5]}"
            return date_str
        except Exception:
            pass
    return val

def to_snake_case(camel_dict: dict) -> dict:
    res = {}
    res["id"] = camel_dict.get("id")
    res["email"] = camel_dict.get("email")
    res["full_name"] = camel_dict.get("fullName") or camel_dict.get("full_name") or ""
    res["role"] = camel_dict.get("role") or "user"
    
    is_act = camel_dict.get("isActive")
    if is_act is None:
        is_act = camel_dict.get("active")
    if is_act is None:
        is_act = camel_dict.get("is_active")
    res["is_active"] = bool(is_act) if is_act is not None else True
    
    is_ver = camel_dict.get("isVerified")
    if is_ver is None:
        is_ver = camel_dict.get("verified")
    if is_ver is None:
        is_ver = camel_dict.get("is_verified")
    res["is_verified"] = bool(is_ver) if is_ver is not None else False
    
    res["avatar_url"] = camel_dict.get("avatarUrl") or camel_dict.get("avatar_url")
    res["phone_number"] = camel_dict.get("phoneNumber") or camel_dict.get("phone_number")
    res["interests"] = camel_dict.get("interests") or ""
    res["skill_level"] = camel_dict.get("skillLevel") or camel_dict.get("skill_level") or "Beginner"
    res["streak_count"] = camel_dict.get("streakCount") or camel_dict.get("streak_count") or 0
    res["total_points"] = camel_dict.get("totalPoints") or camel_dict.get("total_points") or 0
    res["daily_target_minutes"] = camel_dict.get("dailyTargetMinutes") or camel_dict.get("daily_target_minutes") or 30
    
    res["created_at"] = format_datetime(camel_dict.get("createdAt") or camel_dict.get("created_at"))
    res["updated_at"] = format_datetime(camel_dict.get("updatedAt") or camel_dict.get("updated_at"))
    return res


@router.get("", response_model=List[UserOut])
def get_all_users(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
):
    try:
        with httpx.Client() as client:
            response = client.get(
                SPRING_BOOT_URL,
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Spring Boot"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            
            users_list = response.json()
            return [to_snake_case(u) for u in users_list]
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Spring Boot backend unavailable: {exc}")


@router.get("/me", response_model=UserOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme)
):
    try:
        with httpx.Client() as client:
            response = client.get(
                f"{SPRING_BOOT_URL}/{current_user.id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Spring Boot"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            
            return to_snake_case(response.json())
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Spring Boot backend unavailable: {exc}")


@router.patch("/me", response_model=UserOut)
def update_my_profile(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    # Map fields to spring boot User entity format
    update_data = {}
    if payload.full_name is not None:
        update_data["fullName"] = payload.full_name
    if payload.avatar_url is not None:
        update_data["avatarUrl"] = payload.avatar_url
    if payload.phone_number is not None:
        update_data["phoneNumber"] = payload.phone_number
    if payload.interests is not None:
        update_data["interests"] = payload.interests
    if payload.skill_level is not None:
        update_data["skillLevel"] = payload.skill_level
    if payload.daily_target_minutes is not None:
        update_data["dailyTargetMinutes"] = payload.daily_target_minutes

    try:
        with httpx.Client() as client:
            # Update user profile in Spring Boot
            response = client.put(
                f"{SPRING_BOOT_URL}/{current_user.id}",
                json=update_data,
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Spring Boot"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            
            # Log audit event to Spring Boot AuditLog
            audit_payload = {
                "action": "PROFILE_UPDATED",
                "entityType": "user",
                "entityId": str(current_user.id)
            }
            try:
                client.post(
                    SPRING_BOOT_AUDIT_URL,
                    json=audit_payload,
                    headers={"Authorization": f"Bearer {token}"}
                )
            except Exception as e:
                # Log warning but do not fail the request if audit logging has a transient failure
                print(f"Warning: Failed to log audit event in Spring Boot: {e}")
            
            return to_snake_case(response.json())
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Spring Boot backend unavailable: {exc}")