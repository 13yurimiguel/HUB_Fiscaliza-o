"""Utility helpers for the AI assistant service."""
from __future__ import annotations

import logging
import re
from typing import Iterable

logger = logging.getLogger("ai_assistant")


def configure_logging(debug: bool = False) -> None:
    """Configure application logging."""

    level = logging.DEBUG if debug else logging.INFO
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    root_logger = logging.getLogger("ai_assistant")
    if not root_logger.handlers:
        root_logger.addHandler(handler)
    root_logger.setLevel(level)


EMAIL_PATTERN = re.compile(r"[\w\.-]+@[\w\.-]+", re.IGNORECASE)
PHONE_PATTERN = re.compile(r"\b\+?\d[\d\s().-]{7,}\b")
CPF_PATTERN = re.compile(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b")
CNPJ_PATTERN = re.compile(r"\b\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}\b")


def anonymise(text: str) -> str:
    """Mask sensitive information from the supplied text."""

    masked = EMAIL_PATTERN.sub("<email>", text)
    masked = PHONE_PATTERN.sub("<telefone>", masked)
    masked = CPF_PATTERN.sub("<cpf>", masked)
    masked = CNPJ_PATTERN.sub("<cnpj>", masked)
    return masked


def anonymise_iterable(chunks: Iterable[str]) -> str:
    """Anonymise and join multiple text chunks."""

    return "\n".join(anonymise(chunk) for chunk in chunks)
