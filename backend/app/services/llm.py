import httpx
import json
from backend.app.settings import Settings

settings = Settings()

class OllamaClient:
    """Simple wrapper for Ollama REST API calls.
    Supports `generate` endpoint for completion.
    """
    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, model: str = settings.OLLAMA_MODEL):
        self.base_url = base_url.rstrip('/')
        self.model = model
        self.client = httpx.AsyncClient(timeout=30.0)

    async def generate(self, prompt: str, stream: bool = False) -> str:
        """Generate completion from Ollama.
        Returns the generated text (or streamed tokens concatenated).
        """
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": stream,
        }
        url = f"{self.base_url}/api/generate"
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        # If streaming is disabled, Ollama returns a single response with "response" key
        return data.get("response", "")

    async def chat(self, messages: list, stream: bool = False) -> str:
        """Chat endpoint – expects a list of messages with role/content.
        Example message: {"role": "user", "content": "Hello"}
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": stream,
        }
        url = f"{self.base_url}/api/chat"
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("message", {}).get("content", "")
