"""Append-only audit logging primitives."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from typing import Dict, Iterable, List, Optional


@dataclass(frozen=True)
class ImmutableLogEntry:
    """Single append-only log entry."""

    index: int
    timestamp: str
    actor: str
    action: str
    payload: Dict[str, str]
    previous_hash: str
    entry_hash: str


class ImmutableAuditLog:
    """Immutable log that persists entries as JSON lines."""

    def __init__(self, storage_path: Optional[os.PathLike[str] | str] = None) -> None:
        self._entries: List[ImmutableLogEntry] = []
        self._storage_path: Optional[Path] = Path(storage_path) if storage_path else None
        if self._storage_path:
            self._storage_path.parent.mkdir(parents=True, exist_ok=True)
            if self._storage_path.exists():
                self._load()

    def _load(self) -> None:
        assert self._storage_path is not None
        with self._storage_path.open("r", encoding="utf-8") as handle:
            for index, raw_line in enumerate(handle):
                line = json.loads(raw_line)
                entry = ImmutableLogEntry(
                    index=line["index"],
                    timestamp=line["timestamp"],
                    actor=line["actor"],
                    action=line["action"],
                    payload=line["payload"],
                    previous_hash=line["previous_hash"],
                    entry_hash=line["entry_hash"],
                )
                if index != entry.index:
                    raise ValueError("Log corrompido: índice fora de ordem")
                if not self._validate_entry(entry):
                    raise ValueError("Log corrompido: hash inválido")
                self._entries.append(entry)

    def _persist_entry(self, entry: ImmutableLogEntry) -> None:
        if not self._storage_path:
            return
        with self._storage_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry.__dict__, ensure_ascii=False) + "\n")

    def _validate_entry(self, entry: ImmutableLogEntry) -> bool:
        message = self._serialize_message(
            entry.index,
            entry.timestamp,
            entry.actor,
            entry.action,
            entry.payload,
            entry.previous_hash,
        )
        expected_hash = sha256(message.encode("utf-8")).hexdigest()
        return expected_hash == entry.entry_hash

    def _serialize_message(
        self,
        index: int,
        timestamp: str,
        actor: str,
        action: str,
        payload: Dict[str, str],
        previous_hash: str,
    ) -> str:
        base = json.dumps(
            {
                "index": index,
                "timestamp": timestamp,
                "actor": actor,
                "action": action,
                "payload": payload,
                "previous_hash": previous_hash,
            },
            sort_keys=True,
            ensure_ascii=False,
        )
        return base

    def append(self, *, actor: str, action: str, payload: Optional[Dict[str, str]] = None) -> ImmutableLogEntry:
        payload = payload or {}
        index = len(self._entries)
        timestamp = datetime.utcnow().isoformat()
        previous_hash = self._entries[-1].entry_hash if self._entries else "0" * 64
        message = self._serialize_message(index, timestamp, actor, action, payload, previous_hash)
        entry_hash = sha256(message.encode("utf-8")).hexdigest()
        entry = ImmutableLogEntry(
            index=index,
            timestamp=timestamp,
            actor=actor,
            action=action,
            payload=payload,
            previous_hash=previous_hash,
            entry_hash=entry_hash,
        )
        self._entries.append(entry)
        self._persist_entry(entry)
        return entry

    def entries(self) -> Iterable[ImmutableLogEntry]:
        return tuple(self._entries)

    def verify_integrity(self) -> bool:
        return all(self._validate_entry(entry) for entry in self._entries)


__all__ = ["ImmutableAuditLog", "ImmutableLogEntry"]
