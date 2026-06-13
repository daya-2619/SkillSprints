# System Architecture - SkillSprint

```mermaid
graph TD
    Client[Mobile App - React Native]
    CDN[AWS CloudFront]
    S3[AWS S3 - Static/Video Assets]
    ALB[Application Load Balancer]
    API[FastAPI Backend - ECS Fargate]
    VectorDB[pgvector / Qdrant]
    DB[RDS PostgreSQL]
    Cache[Redis - Celery/PubSub]
    LLM[OpenAI / Gemini / Local LLM]
    Worker[Celery Background Workers]

    Client -->|Static Assets| CDN
    CDN --> S3
    Client -->|HTTPS / WSS| ALB
    ALB --> API
    API <--> Cache
    API <--> DB
    API <--> VectorDB
    API -->|Async Tasks| Worker
    Worker <--> LLM
```

## Core Components
- **Mobile Client**: Expo SDK based React Native app using Zustand for global state and React Query for server cache.
- **API Gateway/Backend**: FastAPI orchestrating business logic, auth, and websockets.
- **AI/LLM Layer**: RAG pipeline utilizing vector search against course transcripts to ground the AI Tutor.
- **Asynchronous Workers**: Celery workers handle video encoding, thumbnail generation, and LLM query processing.
