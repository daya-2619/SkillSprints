# AI Tutor & RAG Architecture - SkillSprint

## LLM Strategy
- **Primary**: OpenAI GPT-4o-mini / Gemini 1.5 Flash for high-speed, accurate conversational tutoring.
- **Fallback / Privacy**: Integration for local LLMs (via Ollama) for completely private deployments.

## RAG (Retrieval-Augmented Generation) Pipeline
1. **Ingestion**: When an instructor uploads a video/PDF, a Celery worker generates a transcript, chunks the text, and calls an embedding model (e.g., `text-embedding-3-small`).
2. **Storage**: Vectors are stored in PostgreSQL using the `pgvector` extension.
3. **Querying**: 
   - User asks: "Explain backpropagation."
   - Backend embeds query -> finds top 3 relevant chunks in `pgvector`.
   - Backend constructs prompt: `Context: [Chunks] Question: Explain backpropagation.`
4. **Streaming**: LLM responds via Server-Sent Events (SSE) directly to the mobile app for perceived zero-latency.
