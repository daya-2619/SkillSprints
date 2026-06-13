# Database Schema & Indexing Strategy - SkillSprint

```mermaid
erDiagram
    Users {
        uuid id PK
        string email
        string hashed_password
        string role
        jsonb preferences
        int xp_points
        int current_streak
    }
    
    Courses {
        uuid id PK
        string title
        uuid instructor_id FK
        boolean is_published
        tsvector search_vector
    }

    Modules {
        uuid id PK
        uuid course_id FK
        int order_index
        string title
    }

    Lessons {
        uuid id PK
        uuid module_id FK
        string video_url
        string transcript
        vector embedding
    }

    UserProgress {
        uuid id PK
        uuid user_id FK
        uuid lesson_id FK
        boolean is_completed
        int watch_time_seconds
    }

    Users ||--o{ Courses : "instructs"
    Courses ||--o{ Modules : "contains"
    Modules ||--o{ Lessons : "contains"
    Users ||--o{ UserProgress : "tracks"
```

## Indexing Strategy
- **B-Tree Indexes**: `Users.email`, `Courses.instructor_id`, `UserProgress.user_id`.
- **GIN Indexes**: `Courses.search_vector` for fast full-text search.
- **HNSW / IVFFlat Indexes**: `Lessons.embedding` via pgvector for fast semantic search and RAG retrieval.
