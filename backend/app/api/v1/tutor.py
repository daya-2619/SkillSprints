from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.app.services.rag_service import stream_tutor_response

router = APIRouter()

class AskRequest(BaseModel):
    course_id: int
    query: str

@router.post("/ask")
async def ask_tutor(request: AskRequest):
    async def event_generator():
        async for chunk in stream_tutor_response(request.query, request.course_id):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
