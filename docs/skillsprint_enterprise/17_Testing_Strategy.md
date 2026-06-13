# Testing Strategy - SkillSprint

## Backend
- **Unit Tests**: Pytest mocking DB transactions and LLM calls.
- **Integration Tests**: Docker-Compose stack to test FastAPI + Redis + Postgres interaction.
- **Coverage Target**: 85% for core business logic.

## Frontend
- **Unit Tests**: Jest and `@testing-library/react-native`.
- **E2E Tests**: Detox for running automated flows on iOS Simulator and Android Emulator.

## Load Testing
- **Tool**: Locust.
- **Target**: Feed API and SSE Tutor API must sustain 1000 concurrent users with < 500ms latency.
