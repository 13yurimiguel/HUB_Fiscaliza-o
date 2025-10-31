"""Configuration for the AI assistant service."""
from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal, Optional

from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    app_name: str = Field(default="AI Assistant Service")
    debug: bool = Field(default=False)

    ai_provider: Literal["openai", "azure", "ollama", "mock"] = Field(
        default="mock"
    )
    openai_api_key: Optional[str] = Field(default=None)
    openai_model: str = Field(default="gpt-4o-mini")

    azure_openai_api_key: Optional[str] = Field(default=None)
    azure_openai_endpoint: Optional[str] = Field(default=None)
    azure_openai_deployment: Optional[str] = Field(default=None)

    ollama_endpoint: str = Field(default="http://localhost:11434")
    ollama_model: str = Field(default="llama3")

    conversation_ttl_seconds: int = Field(default=3600)
    max_history_turns: int = Field(default=8)


_ENV_MAPPING: dict[str, str] = {
    "app_name": "AI_ASSISTANT_APP_NAME",
    "debug": "AI_ASSISTANT_DEBUG",
    "ai_provider": "AI_ASSISTANT_PROVIDER",
    "openai_api_key": "OPENAI_API_KEY",
    "openai_model": "OPENAI_MODEL",
    "azure_openai_api_key": "AZURE_OPENAI_API_KEY",
    "azure_openai_endpoint": "AZURE_OPENAI_ENDPOINT",
    "azure_openai_deployment": "AZURE_OPENAI_DEPLOYMENT",
    "ollama_endpoint": "OLLAMA_ENDPOINT",
    "ollama_model": "OLLAMA_MODEL",
    "conversation_ttl_seconds": "AI_ASSISTANT_MEMORY_TTL",
    "max_history_turns": "AI_ASSISTANT_MAX_HISTORY",
}


def _load_from_environment() -> dict[str, str]:
    values: dict[str, str] = {}
    for field, env_key in _ENV_MAPPING.items():
        value = os.getenv(env_key)
        if value is not None:
            values[field] = value
    return values


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached application settings."""

    payload = _load_from_environment()
    return Settings.model_validate(payload)
