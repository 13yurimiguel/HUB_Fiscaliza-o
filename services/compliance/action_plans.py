"""Action plan management for compliance follow-up."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from typing import Dict, Iterable, Optional


class ActionStatus(str, Enum):
    """Lifecycle states for an action item."""

    OPEN = "open"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    CLOSED = "closed"


@dataclass
class ActionItem:
    """Represents a remediation step linked to a finding."""

    identifier: str
    title: str
    owner: str
    due_date: date
    status: ActionStatus = ActionStatus.OPEN
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    verification_notes: Optional[str] = None
    history: Dict[str, str] = field(default_factory=dict)

    def update_status(self, status: ActionStatus, note: Optional[str] = None) -> None:
        """Change the status while logging the change."""

        if status not in ActionStatus:
            raise ValueError(f"Invalid status: {status}")
        self.status = status
        timestamp = datetime.utcnow().isoformat()
        if note:
            self.history[timestamp] = note

    def is_overdue(self, reference_date: Optional[date] = None) -> bool:
        """Check whether the action is overdue."""

        reference_date = reference_date or date.today()
        return self.status != ActionStatus.CLOSED and self.due_date < reference_date


@dataclass
class ActionPlan:
    """A set of action items grouped by an audit report."""

    name: str
    description: str
    items: Dict[str, ActionItem] = field(default_factory=dict)

    def add_item(self, item: ActionItem, *, overwrite: bool = False) -> None:
        if not overwrite and item.identifier in self.items:
            raise KeyError(f"Action item {item.identifier} already exists")
        self.items[item.identifier] = item

    def update_item(
        self, identifier: str, *, status: Optional[ActionStatus] = None, note: Optional[str] = None
    ) -> ActionItem:
        if identifier not in self.items:
            raise KeyError(f"Unknown action item: {identifier}")
        action = self.items[identifier]
        if status:
            action.update_status(status, note)
        elif note:
            action.history[datetime.utcnow().isoformat()] = note
        return action

    def overdue_items(self, reference_date: Optional[date] = None) -> Iterable[ActionItem]:
        return tuple(item for item in self.items.values() if item.is_overdue(reference_date))

    def to_dict(self) -> Dict[str, Dict[str, str]]:
        return {
            identifier: {
                "title": item.title,
                "owner": item.owner,
                "due_date": item.due_date.isoformat(),
                "status": item.status.value,
                "root_cause": item.root_cause,
                "corrective_action": item.corrective_action,
                "verification_notes": item.verification_notes,
                "history": item.history,
            }
            for identifier, item in self.items.items()
        }


__all__ = ["ActionStatus", "ActionItem", "ActionPlan"]
