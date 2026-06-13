# Getting Started

## Prerequisites
- Node.js & npm/yarn
- Python 3.10+
- Docker & Docker Compose
- Terraform

## Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Running with Docker Compose
```bash
docker-compose up --build
```
