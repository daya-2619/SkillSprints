# backend/app/core/security/jwt_auth_middleware.py
import json
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from jose import jwt, JWTError

class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, secret_key: str, algorithm: str = "HS256"):
        super().__init__(app)
        self.secret_key = secret_key
        self.algorithm = algorithm

    async def dispatch(self, request: Request, call_next: Callable):
        # Bypass auth for open endpoints
        if (
            request.url.path.startswith("/health")
            or request.url.path.startswith("/docs")
            or request.url.path.startswith("/openapi.json")
            or request.url.path.startswith("/api/v1/auth/")
        ):
            return await call_next(request)
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return json_response({"detail": "Unauthorized"}, status_code=401)
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            request.state.user = payload
        except JWTError:
            return json_response({"detail": "Invalid token"}, status_code=401)
        return await call_next(request)

def json_response(content: dict, status_code: int = 200):
    from fastapi.responses import JSONResponse
    return JSONResponse(content=content, status_code=status_code)
