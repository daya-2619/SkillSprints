# 🚀 SkillSprint 

<div align="center">
  <p><strong>The AI-Powered Micro-Learning Platform of the Future.</strong></p>
  <p>SkillSprint blends the engaging, short-form mechanics of TikTok/Instagram Reels with the educational depth of a premier tech academy. Designed to help students and professionals master AI, Programming, Data Science, and Cloud concepts in 5-10 minute daily sprints.</p>
</div>

---

## 🌟 Features

- **TikTok-Style Learning Feed**: Swipe through an infinite stream of highly engaging, 60fps vertical short-form educational videos driven by `react-native-reanimated`.
- **AI Tutor (RAG Pipeline)**: Don't understand a concept? The integrated AI Tutor uses an advanced RAG (Retrieval-Augmented Generation) pipeline backed by `pgvector` to stream context-aware answers directly to your chat interface with zero latency (via SSE).
- **Gamification**: Master topics and maintain your learning streak, earn XP, and unlock badges managed seamlessly via local `zustand` states and server-synced tracking.
- **Embedded Coding Labs**: Directly launch interactive Jupyter Notebooks and CodeSandbox environments via a highly secure, JWT-authenticated PostMessage WebView bridge.

---

## 🏗 Architecture

SkillSprint is built for massive enterprise scale.

### Frontend (Mobile App)
- **Framework**: React Native (Expo SDK 50) + Expo Router
- **State Management**: Zustand (Client) + TanStack React Query (Server)
- **Animations**: React Native Reanimated + Gesture Handler
- **Validation**: Zod + React Hook Form

### Backend (Microservices)
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with `pgvector` extension for embeddings
- **ORM & Migrations**: SQLAlchemy 2.0 (Async) + Alembic
- **Asynchronous Workers**: Celery + Redis
- **Authentication**: Stateless JWT with sliding expiration and RBAC

---

## 📚 Enterprise Documentation

The architecture has been rigorously documented across 20 extensive deliverables. Please see the `docs/skillsprint_enterprise/` directory to dive deep into the platform's design:

1. [Product Requirements Document](docs/skillsprint_enterprise/01_Product_Requirements_Document.md)
2. [System Architecture](docs/skillsprint_enterprise/02_System_Architecture.md)
3. [Database Schema](docs/skillsprint_enterprise/03_Database_Schema.md)
4. [API Specifications](docs/skillsprint_enterprise/04_API_Specifications.md)
5. [Frontend Architecture](docs/skillsprint_enterprise/05_Frontend_Architecture.md)
... and 15 more covering everything from Recommendation Engines to Production Deployment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.11
- Docker Desktop
- PostgreSQL >= 15 (with `pgvector` extension installed)

### Booting the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt # or via pyproject.toml
uvicorn app.main:app --reload
```

### Booting the Frontend
```bash
cd frontend
npm install
npx expo start
```

---

## 🔒 License
Proprietary & Confidential. All rights reserved by SkillSprint Inc.
