"""Configuration for the AI assistant service."""
from __future__ import annotations

from functools import lru_cache
from typing import Literal, Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = Field("AI Assistant Service", env="AI_ASSISTANT_APP_NAME")
    debug: bool = Field(False, env="AI_ASSISTANT_DEBUG")

    ai_provider: Literal["openai", "azure", "ollama", "mock"] = Field(
        "mock", env="AI_ASSISTANT_PROVIDER"
    )
    openai_api_key: Optional[str] = Field(None, env="OPENAI_API_KEY")
    openai_model: str = Field("gpt-4o-mini", env="OPENAI_MODEL")

    azure_openai_api_key: Optional[str] = Field(None, env="AZURE_OPENAI_API_KEY")
    azure_openai_endpoint: Optional[str] = Field(None, env="AZURE_OPENAI_ENDPOINT")
    azure_openai_deployment: Optional[str] = Field(
        None, env="AZURE_OPENAI_DEPLOYMENT"
    )

    ollama_endpoint: str = Field("http://localhost:11434", env="OLLAMA_ENDPOINT")
    ollama_model: str = Field("llama3", env="OLLAMA_MODEL")

    conversation_ttl_seconds: int = Field(3600, env="AI_ASSISTANT_MEMORY_TTL")
    max_history_turns: int = Field(8, env="AI_ASSISTANT_MAX_HISTORY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
