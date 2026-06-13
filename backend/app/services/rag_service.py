import asyncio
import os
from typing import AsyncGenerator

# Mocking the actual LLM and Embedding provider for Phase 3
# In production, replace with langchain.embeddings.OpenAIEmbeddings and langchain.chat_models.ChatOpenAI

class MockEmbeddings:
    def embed_query(self, text: str):
        # Return a mock 1536-dimensional vector
        return [0.0] * 1536

class MockChatModel:
    async def stream_response(self, prompt: str) -> AsyncGenerator[str, None]:
        response = f"This is an AI generated response to your query based on the course material: '{prompt}'.\n\nIt streams chunk by chunk."
        words = response.split(" ")
        for word in words:
            yield word + " "
            await asyncio.sleep(0.1)

async def stream_tutor_response(query: str, course_id: int) -> AsyncGenerator[str, None]:
    # 1. Retrieve context (Mocked)
    # db_chunks = db.query(LessonChunk).order_by(LessonChunk.embedding.cosine_distance(query_vector)).limit(3).all()
    context = "Mock retrieved context from video transcript about backpropagation."
    
    # 2. Construct Prompt
    prompt = f"Context: {context}\nUser: {query}\nTutor:"
    
    # 3. Stream Response
    llm = MockChatModel()
    async for chunk in llm.stream_response(prompt):
        yield chunk
