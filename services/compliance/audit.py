"""Audit report generation utilities."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Iterable, List, Optional

from .action_plans import ActionPlan
from .checklists import Checklist, ChecklistItem, ChecklistStatus


@dataclass
class AuditFinding:
    """Represents a non-conformity or improvement opportunity."""

    identifier: str
    clause: str
    description: str
    risk_level: str
    evidence: Optional[str] = None
    recommendation: Optional[str] = None


@dataclass
class AuditReport:
    """Structured view of an audit execution."""

    title: str
    audit_date: datetime
    auditor: str
    scope: str
    checklist_summary: Dict[str, Dict[str, str]]
    findings: List[AuditFinding] = field(default_factory=list)
    action_plan: Optional[ActionPlan] = None
    metrics: Dict[str, float] = field(default_factory=dict)


class AuditReportBuilder:
    """Builder that derives findings and metrics from checklists."""

    def __init__(self, checklist: Checklist, *, scope: str, auditor: str) -> None:
        self.checklist = checklist
        self.scope = scope
        self.auditor = auditor
        self._findings: List[AuditFinding] = []
        self._metrics: Dict[str, float] = {}

    def derive_findings(self) -> "AuditReportBuilder":
        non_compliant: Iterable[ChecklistItem] = self.checklist.non_compliant_items()
        for item in non_compliant:
            self._findings.append(
                AuditFinding(
                    identifier=item.identifier,
                    clause=item.clause,
                    description=item.question,
                    risk_level="alto",
                    evidence=item.evidence,
                    recommendation="Implementar ação corretiva alinhada ao requisito ISO 9001 correspondente.",
                )
            )
        return self

    def compute_metrics(self) -> "AuditReportBuilder":
        total_items = len(self.checklist.items)
        compliant = sum(1 for item in self.checklist.items.values() if item.status == ChecklistStatus.COMPLIANT)
        self._metrics = {
            "total_items": float(total_items),
            "compliant_items": float(compliant),
            "compliance_ratio": self.checklist.progress(),
        }
        return self

    def build(self, *, title: str, action_plan: Optional[ActionPlan] = None) -> AuditReport:
        if not self._metrics:
            self.compute_metrics()
        report = AuditReport(
            title=title,
            audit_date=datetime.utcnow(),
            auditor=self.auditor,
            scope=self.scope,
            checklist_summary=self.checklist.to_dict(),
            findings=list(self._findings),
            action_plan=action_plan,
            metrics=self._metrics,
        )
        return report


__all__ = ["AuditFinding", "AuditReport", "AuditReportBuilder"]
