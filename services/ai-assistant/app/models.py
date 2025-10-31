"""Pydantic models for the assistant API."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class PhotoContext(BaseModel):
    url: Optional[str] = Field(None, description="URL da foto")
    caption: Optional[str] = Field(None, description="Descrição da foto")
    tags: List[str] = Field(default_factory=list, description="Etiquetas associadas à evidência")


class ChecklistContext(BaseModel):
    title: Optional[str] = Field(None, description="Título do checklist")
    status: Optional[str] = Field(None, description="Status geral")
    non_conformities: List[str] = Field(default_factory=list, description="Não conformidades")


class WorksiteContext(BaseModel):
    name: Optional[str] = Field(None)
    location: Optional[str] = Field(None)
    status: Optional[str] = Field(None)
    description: Optional[str] = Field(None)


class AssistantContext(BaseModel):
    worksite: Optional[WorksiteContext] = None
    photos: List[PhotoContext] = Field(default_factory=list)
    checklists: List[ChecklistContext] = Field(default_factory=list)


class ChatRequest(BaseModel):
    conversation_id: str = Field(..., description="Identificador da conversa")
    query: str = Field(..., description="Pergunta do usuário")
    context: AssistantContext = Field(default_factory=AssistantContext)


class AssistantResponse(BaseModel):
    conversation_id: str
    response: str


class SuggestionRequest(BaseModel):
    conversation_id: str
    report_section: str
    summary: Optional[str] = None
    context: AssistantContext = Field(default_factory=AssistantContext)


class SuggestionResponse(BaseModel):
    conversation_id: str
    section: str
    suggestion: str
