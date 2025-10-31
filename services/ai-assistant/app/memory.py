"""In-memory conversational state management."""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from threading import RLock
from typing import Dict, List, MutableMapping, Optional

from .config import get_settings


@dataclass
class Message:
    """Representation of a single conversational message."""

    role: str
    content: str


@dataclass
class Conversation:
    """Container for a conversational history."""

    conversation_id: str
    messages: List[Message] = field(default_factory=list)
    last_updated: float = field(default_factory=lambda: time.time())

    def append(self, role: str, content: str) -> None:
        self.messages.append(Message(role=role, content=content))
        self.last_updated = time.time()

    def truncated_messages(self, max_turns: int) -> List[Message]:
        if max_turns <= 0 or len(self.messages) <= max_turns:
            return list(self.messages)
        return self.messages[-max_turns:]


class ConversationStore:
    """Thread-safe in-memory conversation store with TTL eviction."""

    def __init__(self) -> None:
        self._conversations: MutableMapping[str, Conversation] = {}
        self._lock = RLock()

    def get(self, conversation_id: str) -> Conversation:
        with self._lock:
            convo = self._conversations.get(conversation_id)
            if convo is None:
                convo = Conversation(conversation_id=conversation_id)
                self._conversations[conversation_id] = convo
            return convo

    def append(self, conversation_id: str, role: str, content: str) -> None:
        convo = self.get(conversation_id)
        convo.append(role=role, content=content)

    def prune_expired(self) -> None:
        settings = get_settings()
        ttl = settings.conversation_ttl_seconds
        now = time.time()
        expired: List[str] = []
        with self._lock:
            for key, convo in self._conversations.items():
                if now - convo.last_updated > ttl:
                    expired.append(key)
            for key in expired:
                del self._conversations[key]


_store: Optional[ConversationStore] = None


def get_store() -> ConversationStore:
    global _store
    if _store is None:
        _store = ConversationStore()
    return _store
