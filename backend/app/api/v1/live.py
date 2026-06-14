# backend/app/api/v1/live.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/rooms")
async def list_live_rooms():
    """Return a placeholder list of live session rooms."""
    return [
        {"id": "room1", "title": "Live AI Q&A", "host": "Instructor A"},
        {"id": "room2", "title": "Data Science Workshop", "host": "Instructor B"},
    ]

@router.get("/rooms/{room_id}")
async def get_live_room(room_id: str):
    # In a real implementation you would fetch from DB or streaming service
    return {"id": room_id, "title": f"Live Session {room_id}", "host": "Instructor X"}
