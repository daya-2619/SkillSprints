from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application configuration settings.
    Uses environment variables with sensible defaults.
    """
    # Ollama LLM provider configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"

    # FastAPI settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    RELOAD: bool = False

    # Database settings
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "skillsprint"
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = False
