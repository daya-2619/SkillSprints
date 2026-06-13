# Folder Structure - SkillSprint

## Root Directory
```text
SkillSprint/
├── frontend/             # React Native (Expo) app
├── backend/              # FastAPI application
├── infra/                # Terraform modules
├── docs/                 # Enterprise architecture docs & PRDs
├── design/               # UI/UX mockups
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Local dev orchestration
└── README.md
```

## Frontend Details
`frontend/src/`
- `app/`: Expo Router file-based routing.
- `components/`: UI components (Feed, VideoPlayer).
- `store/`: Zustand global states.
- `hooks/`: TanStack query hooks.
- `theme/`: Design tokens.

## Backend Details
`backend/app/`
- `api/v1/`: Endpoints.
- `models/`: SQLAlchemy tables.
- `schemas/`: Pydantic models.
- `services/`: Business logic.
- `core/`: Settings and DB connections.
