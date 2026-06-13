// backend/app/api/v1/quiz.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm import OllamaClient

router = APIRouter()

ollama = OllamaClient()

class QuizRequest(BaseModel):
    topic: str
    num_questions: int = 5
    stream: bool = False

@router.post("/generate")
async def generate_quiz(req: QuizRequest):
    """Generate a quiz for a given topic using Ollama.
    The prompt asks Ollama to return JSON with `question`, `options`, and `answer` fields.
    """
    prompt = (
        f"Create a quiz on the topic '{req.topic}'. Provide exactly {req.num_questions} questions. "
        "Return the result as a JSON array where each element has:\n"
        "  - `question`: string\n"
        "  - `options`: array of 4 strings\n"
        "  - `answer`: index (0‑based) of the correct option.\n"
        "Do not include any extra text, just the JSON."
    )
    try:
        raw = await ollama.generate(prompt, stream=req.stream)
        # We assume the LLM returns valid JSON; in production you would add validation.
        return {"quiz": raw}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
