"""Client abstractions for language model providers."""
from __future__ import annotations

import json

try:
    from openai import AzureOpenAI, OpenAI
except Exception:  # pragma: no cover - optional dependency
    AzureOpenAI = OpenAI = None  # type: ignore

import httpx

from .config import get_settings
from .utils import logger


class LLMClient:
    """Base client interface."""

    async def generate(self, prompt: str, *, temperature: float = 0.2) -> str:
        raise NotImplementedError


class OpenAILLM(LLMClient):
    """OpenAI Chat Completions client."""

    def __init__(self) -> None:
        settings = get_settings()
        if OpenAI is None:
            raise RuntimeError("openai package not available")
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required for OpenAI provider")
        self._client = OpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    async def generate(self, prompt: str, *, temperature: float = 0.2) -> str:
        response = await self._client.chat.completions.create(  # type: ignore[attr-defined]
            model=self._model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
        )
        return response.choices[0].message["content"]  # type: ignore[index]


class AzureOpenAILLM(LLMClient):
    """Azure OpenAI Chat Completions client."""

    def __init__(self) -> None:
        settings = get_settings()
        if AzureOpenAI is None:
            raise RuntimeError("openai package not available")
        if not (settings.azure_openai_api_key and settings.azure_openai_endpoint and settings.azure_openai_deployment):
            raise RuntimeError("Azure OpenAI credentials are incomplete")
        self._client = AzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version="2024-02-15-preview",
            azure_endpoint=settings.azure_openai_endpoint,
        )
        self._deployment = settings.azure_openai_deployment

    async def generate(self, prompt: str, *, temperature: float = 0.2) -> str:
        response = await self._client.chat.completions.create(  # type: ignore[attr-defined]
            model=self._deployment,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
        )
        return response.choices[0].message["content"]  # type: ignore[index]


class OllamaLLM(LLMClient):
    """Client for local Ollama models."""

    def __init__(self) -> None:
        settings = get_settings()
        self._endpoint = settings.ollama_endpoint.rstrip("/")
        self._model = settings.ollama_model

    async def generate(self, prompt: str, *, temperature: float = 0.2) -> str:
        payload = {"model": self._model, "prompt": prompt, "options": {"temperature": temperature}}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{self._endpoint}/api/generate", json=payload)
            response.raise_for_status()
            text = ""
            for line in response.iter_text():
                if not line:
                    continue
                data = json.loads(line)
                text += data.get("response", "")
            return text


class MockLLM(LLMClient):
    """Deterministic responses for local development and testing."""

    async def generate(self, prompt: str, *, temperature: float = 0.2) -> str:  # noqa: ARG002 - interface requirement
        snippet = prompt[-500:]
        logger.debug("Mock LLM invoked with prompt snippet: %s", snippet)
        return (
            "1. Escopo da Análise\n"
            "Responder à solicitação do usuário com base no contexto fornecido.\n\n"
            "2. Contexto da Obra\n"
            "Resumo automático gerado para fins de desenvolvimento.\n\n"
            "3. Observações Relevantes\n"
            "- Assegure-se de validar com a equipe de campo.\n\n"
            "4. Não Conformidades Identificadas\n"
            "- Nenhuma não conformidade foi confirmada durante o modo simulado.\n\n"
            "5. Ações Corretivas e Preventivas Recomendadas\n"
            "- Elaborar plano de inspeção detalhado.\n\n"
            "6. Evidências Registradas\n"
            "- Documentação pendente de upload.\n\n"
            "7. Próximos Passos e Monitoramento\n"
            "- Acompanhar atualização da base de dados."
        )


def get_llm_client() -> LLMClient:
    settings = get_settings()
    provider = settings.ai_provider.lower()
    logger.debug("Selecting LLM provider: %s", provider)

    if provider == "openai":
        return OpenAILLM()
    if provider == "azure":
        return AzureOpenAILLM()
    if provider == "ollama":
        return OllamaLLM()
    return MockLLM()
