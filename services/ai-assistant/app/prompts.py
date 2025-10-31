"""Prompt templates and builders for the assistant."""
from __future__ import annotations

from textwrap import dedent
from typing import Any, Dict, Iterable, List, Optional

from .memory import Message

ISO_9001_TEMPLATE = dedent(
    """
    Você é um auditor de qualidade experiente seguindo a norma ISO 9001.
    Estruture a resposta utilizando as seções obrigatórias abaixo, mantendo linguagem técnica e formal.

    1. Escopo da Análise
    2. Contexto da Obra
    3. Observações Relevantes
    4. Não Conformidades Identificadas
    5. Ações Corretivas e Preventivas Recomendadas
    6. Evidências Registradas
    7. Próximos Passos e Monitoramento
    """
).strip()


def build_context_prompt(context: Dict[str, Any]) -> str:
    """Build a concise context summary for the LLM."""

    worksite = context.get("worksite") or {}
    photos = context.get("photos") or []
    checklists = context.get("checklists") or []

    worksite_parts: List[str] = []
    if worksite:
        name = worksite.get("name", "Obra sem identificação")
        location = worksite.get("location", "Localização não informada")
        status = worksite.get("status", "Status não informado")
        worksite_parts.append(f"Obra: {name}\nLocalização: {location}\nStatus: {status}")
        if worksite.get("description"):
            worksite_parts.append(f"Descrição: {worksite['description']}")

    photo_parts: List[str] = []
    for photo in photos:
        caption = photo.get("caption", "Foto sem legenda")
        tags = ", ".join(photo.get("tags", []))
        photo_parts.append(f"- {caption} (tags: {tags or 'sem tags'})")

    checklist_parts: List[str] = []
    for checklist in checklists:
        title = checklist.get("title", "Checklist sem título")
        status = checklist.get("status", "indefinido")
        non_conformities = checklist.get("non_conformities", [])
        checklist_parts.append(
            "\n".join(
                [
                    f"Checklist: {title}",
                    f"Status geral: {status}",
                    "Não conformidades:" if non_conformities else "Sem não conformidades registradas.",
                ]
            )
        )
        for item in non_conformities:
            checklist_parts.append(f"  - {item}")

    parts: List[str] = ["Contextualize a análise com base nas informações a seguir:"]
    if worksite_parts:
        parts.append("Dados da obra:\n" + "\n".join(worksite_parts))
    if photo_parts:
        parts.append("Resumo das evidências fotográficas:\n" + "\n".join(photo_parts))
    if checklist_parts:
        parts.append("Síntese dos checklists:\n" + "\n".join(checklist_parts))

    return "\n\n".join(parts)


def build_conversation_history(messages: Iterable[Message]) -> str:
    """Serialise conversation history into a format suitable for the LLM."""

    lines: List[str] = []
    for message in messages:
        role = "Auditor" if message.role == "assistant" else "Usuário"
        lines.append(f"{role}: {message.content}")
    return "\n".join(lines)


def build_final_prompt(context: Dict[str, Any], history: Iterable[Message], query: str) -> str:
    """Compose the final prompt delivered to the language model."""

    prompt_parts = [ISO_9001_TEMPLATE, "\n"]
    prompt_parts.append(build_context_prompt(context))
    history_text = build_conversation_history(history)
    if history_text:
        prompt_parts.append("\nHistórico da conversa:\n" + history_text)
    prompt_parts.append("\nPergunta atual do usuário:\n" + query)
    prompt_parts.append(
        "\nInstrua de maneira estruturada, mantendo objetividade, citando referências ao contexto e destacando lacunas de informação relevantes."
    )
    return "\n".join(prompt_parts)
