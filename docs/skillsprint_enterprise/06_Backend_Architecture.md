# Backend Architecture - SkillSprint

## Frameworks
- **FastAPI**: High-performance, async-first Python web framework.
- **SQLAlchemy 2.0**: Async ORM for PostgreSQL.
- **Alembic**: Database migrations.
- **Celery**: Distributed task queue for video processing and heavy ML tasks.
- **Redis**: Caching, Rate Limiting, Celery broker, and Pub/Sub for WebSockets.

## Folder Structure
- `app/api/`: Versioned API routers.
- `app/core/`: Security, config, JWT logic.
- `app/models/`: SQLAlchemy declarative models.
- `app/schemas/`: Pydantic schemas for request/response validation.
- `app/services/`: Business logic, LLM integrations, RAG pipelines.
- `app/tasks/`: Celery background tasks.

## Design Patterns
- **Dependency Injection**: Used heavily by FastAPI for DB sessions and current user injection.
- **Repository Pattern**: (Optional) Abstracting DB queries from route handlers to ensure testability.
