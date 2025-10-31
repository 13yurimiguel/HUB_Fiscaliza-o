"""LGPD policy definitions and helpers."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, Iterable, List, Mapping, MutableMapping, Optional


@dataclass(frozen=True)
class ConsentPolicy:
    """Describes how consent is captured, stored and revoked."""

    version: str
    lawful_basis: str
    capture_mechanism: str
    storage_location: str
    retention_period_days: int
    revocation_process: str

    def next_review_date(self, *, since: Optional[date] = None) -> date:
        """Calculate the next review date for the consent policy."""

        since = since or date.today()
        return since + timedelta(days=self.retention_period_days)


@dataclass(frozen=True)
class EncryptionPolicy:
    """Defines encryption requirements relying on a KMS."""

    kms_provider: str
    key_alias: str
    rotation_interval_days: int
    data_classification: str
    backup_location: str

    def enforceable_controls(self) -> List[str]:
        return [
            "Uso obrigatório de chaves gerenciadas (KMS) com rotação automática.",
            f"Alias principal: {self.key_alias} gerenciado pelo provedor {self.kms_provider}.",
            "Logs de acesso criptografados e integrados ao mecanismo de trilha imutável.",
        ]


@dataclass(frozen=True)
class AnonymizationPolicy:
    """Specifies anonymisation techniques for AI training datasets."""

    methodology: str
    pii_fields: List[str]
    risk_assessment: str
    reidentification_threshold: float

    def describe(self) -> str:
        return (
            f"Metodologia: {self.methodology}. Campos sensíveis: {', '.join(self.pii_fields)}. "
            f"Limite de reidentificação: {self.reidentification_threshold:.2%}."
        )


@dataclass
class LGPDPolicyBundle:
    """Grouping of policies applied to a dataset or product."""

    identifier: str
    consent: ConsentPolicy
    encryption: EncryptionPolicy
    anonymization: AnonymizationPolicy
    metadata: Dict[str, str] = field(default_factory=dict)


class LGPDPolicyRegistry:
    """Simple registry to manage multiple bundles."""

    def __init__(self) -> None:
        self._bundles: Dict[str, LGPDPolicyBundle] = {}

    def register(self, bundle: LGPDPolicyBundle, *, overwrite: bool = False) -> None:
        if not overwrite and bundle.identifier in self._bundles:
            raise KeyError(f"Bundle {bundle.identifier} já registrado")
        self._bundles[bundle.identifier] = bundle

    def get(self, identifier: str) -> LGPDPolicyBundle:
        if identifier not in self._bundles:
            raise KeyError(f"Bundle {identifier} não encontrado")
        return self._bundles[identifier]

    def all(self) -> Iterable[LGPDPolicyBundle]:
        return tuple(self._bundles.values())


def anonymise_dataset(records: Iterable[Mapping[str, str]], *, pii_fields: Iterable[str]) -> List[Dict[str, str]]:
    """Return a deep-copied version of the dataset with selected fields anonymised."""

    pii_fields = set(pii_fields)
    anonymised: List[Dict[str, str]] = []
    for record in records:
        mutable_record: MutableMapping[str, str] = dict(record)
        for field in pii_fields:
            if field in mutable_record:
                mutable_record[field] = "***anonimizado***"
        anonymised.append(dict(mutable_record))
    return anonymised


__all__ = [
    "ConsentPolicy",
    "EncryptionPolicy",
    "AnonymizationPolicy",
    "LGPDPolicyBundle",
    "LGPDPolicyRegistry",
    "anonymise_dataset",
]
