from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
import httpx

from app.core.deps import get_current_user, oauth2_scheme
from app.models.user import User

router = APIRouter(prefix="/api/planner", tags=["Study Planner"])

NODE_JS_URL = "http://localhost:5000/api/planner"

# --- Pydantic Schemas ---
class TaskCreateRequest(BaseModel):
    task: str
    target_date: str

class TaskOut(BaseModel):
    id: str
    task: str
    target_date: str
    is_completed: bool
    created_at: str


# --- Endpoints ---
@router.get("", response_model=List[TaskOut])
def get_my_tasks(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
):
    try:
        with httpx.Client() as client:
            response = client.get(
                NODE_JS_URL,
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Node.js"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Node.js backend unavailable: {exc}")


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreateRequest,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
):
    try:
        with httpx.Client() as client:
            response = client.post(
                NODE_JS_URL,
                json={"task": payload.task, "target_date": payload.target_date},
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 201:
                detail_msg = "Error calling Node.js"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Node.js backend unavailable: {exc}")


@router.patch("/{task_id}", response_model=TaskOut)
def toggle_task(
    task_id: str,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
):
    try:
        with httpx.Client() as client:
            response = client.patch(
                f"{NODE_JS_URL}/{task_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Node.js"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Node.js backend unavailable: {exc}")


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: str,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
):
    try:
        with httpx.Client() as client:
            response = client.delete(
                f"{NODE_JS_URL}/{task_id}",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code != 200:
                detail_msg = "Error calling Node.js"
                try:
                    detail_msg = response.json().get("error", detail_msg)
                except Exception:
                    pass
                raise HTTPException(status_code=response.status_code, detail=detail_msg)
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"Node.js backend unavailable: {exc}")
