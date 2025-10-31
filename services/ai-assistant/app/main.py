"""FastAPI application exposing the AI assistant endpoints."""
from __future__ import annotations

from typing import Any, Dict

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .llm import LLMClient, get_llm_client
from .memory import get_store
from .models import (
    AssistantResponse,
    ChatRequest,
    SuggestionRequest,
    SuggestionResponse,
)
from .prompts import build_final_prompt
from .utils import anonymise_iterable, configure_logging, logger


async def _get_llm() -> LLMClient:
    return get_llm_client()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings.debug)

    app = FastAPI(title=settings.app_name, debug=settings.debug)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.post("/chat", response_model=AssistantResponse)
    async def chat(
        payload: ChatRequest,
        llm: LLMClient = Depends(_get_llm),
    ) -> AssistantResponse:
        store = get_store()
        store.prune_expired()
        settings = get_settings()

        conversation = store.get(payload.conversation_id)
        conversation.append("user", payload.query)
        history = conversation.truncated_messages(settings.max_history_turns)

        context_dict: Dict[str, Any] = payload.context.dict(by_alias=True)
        prompt = build_final_prompt(context_dict, history, payload.query)
        sanitised_prompt = anonymise_iterable([prompt])
        logger.info("Sending prompt to LLM", extra={"conversation_id": payload.conversation_id})

        try:
            response_text = await llm.generate(sanitised_prompt)
        except Exception as exc:  # pragma: no cover - network failure
            logger.exception("LLM invocation failed")
            raise HTTPException(status_code=502, detail="Erro ao consultar o modelo") from exc

        conversation.append("assistant", response_text)

        return AssistantResponse(conversation_id=payload.conversation_id, response=response_text)

    @app.post("/suggestion", response_model=SuggestionResponse)
    async def suggestion(
        payload: SuggestionRequest,
        llm: LLMClient = Depends(_get_llm),
    ) -> SuggestionResponse:
        store = get_store()
        store.prune_expired()
        settings = get_settings()

        conversation = store.get(payload.conversation_id)
        summary = payload.summary or "Forneça recomendações específicas para o relatório."
        conversation.append("user", f"Solicitação de sugestão para {payload.report_section}: {summary}")
        history = conversation.truncated_messages(settings.max_history_turns)

        context_dict: Dict[str, Any] = payload.context.dict(by_alias=True)
        prompt = build_final_prompt(context_dict, history, summary)
        prompt += (
            "\n\nFormate a resposta com foco na seção solicitada do relatório, destacando ações mensuráveis e referências às evidências disponíveis."
        )
        sanitised_prompt = anonymise_iterable([prompt])
        logger.info(
            "Solicitando sugestão de relatório",
            extra={"conversation_id": payload.conversation_id, "section": payload.report_section},
        )

        try:
            response_text = await llm.generate(sanitised_prompt)
        except Exception as exc:  # pragma: no cover
            logger.exception("LLM invocation failed")
            raise HTTPException(status_code=502, detail="Erro ao consultar o modelo") from exc

        conversation.append("assistant", response_text)

        return SuggestionResponse(
            conversation_id=payload.conversation_id,
            section=payload.report_section,
            suggestion=response_text,
        )

    @app.get("/health")
    async def health() -> Dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
