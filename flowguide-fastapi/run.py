"""
FlowGuide FastAPI - Run Script
Usage: python run.py
"""

import uvicorn

from app.core.config import settings

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print(f"  {settings.APP_NAME} starting...")
    print(f"  URL : http://localhost:{settings.APP_PORT}")
    print(f"  Docs: http://localhost:{settings.APP_PORT}/docs")
    print("=" * 50 + "\n")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.APP_PORT,
        reload=True,
    )