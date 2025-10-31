"""Checklist utilities supporting ISO 9001 aligned audits."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, Iterable, Optional


class ChecklistStatus(str, Enum):
    """Status values for checklist items."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"


@dataclass
class ChecklistItem:
    """A single checklist question mapped to an ISO 9001 clause."""

    identifier: str
    clause: str
    question: str
    status: ChecklistStatus = ChecklistStatus.PENDING
    evidence: Optional[str] = None
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def mark(self, status: ChecklistStatus, evidence: Optional[str] = None) -> None:
        """Update the status for the item."""

        if status not in ChecklistStatus:
            raise ValueError(f"Invalid status: {status}")
        self.status = status
        if evidence:
            self.evidence = evidence
        self.updated_at = datetime.utcnow()


@dataclass
class Checklist:
    """A checklist tailored to a specific audit scope."""

    name: str
    items: Dict[str, ChecklistItem] = field(default_factory=dict)

    def add_item(self, item: ChecklistItem, *, overwrite: bool = False) -> None:
        """Insert a new checklist item."""

        if not overwrite and item.identifier in self.items:
            raise KeyError(f"Item {item.identifier} already exists")
        self.items[item.identifier] = item

    def mark_item(
        self, identifier: str, status: ChecklistStatus, *, evidence: Optional[str] = None
    ) -> ChecklistItem:
        """Convenience helper to mark an item by identifier."""

        if identifier not in self.items:
            raise KeyError(f"Unknown checklist item: {identifier}")
        item = self.items[identifier]
        item.mark(status, evidence)
        return item

    def progress(self) -> float:
        """Return the completion ratio for compliant items."""

        if not self.items:
            return 0.0
        compliant = sum(1 for item in self.items.values() if item.status == ChecklistStatus.COMPLIANT)
        return compliant / len(self.items)

    def non_compliant_items(self) -> Iterable[ChecklistItem]:
        """Yield all non-compliant items."""

        return tuple(item for item in self.items.values() if item.status == ChecklistStatus.NON_COMPLIANT)

    def to_dict(self) -> Dict[str, Dict[str, str]]:
        """Serialise the checklist to a JSON-friendly structure."""

        return {
            identifier: {
                "clause": item.clause,
                "question": item.question,
                "status": item.status.value,
                "evidence": item.evidence,
                "updated_at": item.updated_at.isoformat(),
            }
            for identifier, item in self.items.items()
        }


__all__ = ["Checklist", "ChecklistItem", "ChecklistStatus"]
