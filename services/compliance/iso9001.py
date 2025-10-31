"""ISO 9001 clause mapping utilities."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List


@dataclass(frozen=True)
class ISOClause:
    """Representation of an ISO 9001 clause and its functional expectations."""

    clause: str
    title: str
    topic: str
    description: str
    functional_requirements: List[str]


_CLAUSES: List[ISOClause] = [
    ISOClause(
        clause="7.5",
        title="Informação documentada",
        topic="documentacao",
        description=(
            "Estabelece que a organização deve criar, controlar e manter informações documentadas "
            "para garantir a execução eficaz dos processos e a conformidade com os requisitos do sistema de gestão da qualidade."
        ),
        functional_requirements=[
            "Repositório versionado para procedimentos, políticas e instruções de trabalho.",
            "Mecanismos de aprovação e revisão com trilha de auditoria.",
            "Controle de acesso baseado em papéis para documentos sensíveis.",
        ],
    ),
    ISOClause(
        clause="8.5.2",
        title="Identificação e rastreabilidade",
        topic="rastreabilidade",
        description=(
            "Requer que produtos e entregáveis sejam identificados e rastreados ao longo de todo o ciclo de vida, "
            "assegurando a vinculação entre requisitos, evidências e resultados de auditoria."
        ),
        functional_requirements=[
            "Cadastro de ativos auditáveis com códigos únicos e metadados.",
            "Logs imutáveis para registrar eventos, responsáveis e timestamps.",
            "Relacionamento entre não conformidades, ações corretivas e evidências anexadas.",
        ],
    ),
    ISOClause(
        clause="9.2",
        title="Auditoria interna",
        topic="auditoria",
        description=(
            "Determina que a organização deve conduzir auditorias internas planejadas para prover informação sobre a conformidade "
            "do SGQ e a implementação eficaz dos requisitos."
        ),
        functional_requirements=[
            "Plano de auditoria com escopo, critérios, frequência e responsáveis definidos.",
            "Checklists customizáveis alinhados aos requisitos regulatórios e contratuais.",
            "Relatórios estruturados com achados, evidências, classificação de risco e planos de ação vinculados.",
        ],
    ),
    ISOClause(
        clause="9.1.1",
        title="Monitoramento, medição, análise e avaliação",
        topic="auditoria",
        description=(
            "Estabelece a necessidade de monitorar e medir processos para demonstrar a conformidade e avaliar o desempenho do SGQ."
        ),
        functional_requirements=[
            "Indicadores-chave de desempenho para acompanhar ações corretivas.",
            "Dashboards de status das auditorias com evidências anexas.",
            "Alertas automatizados para prazos críticos e reincidência de não conformidades.",
        ],
    ),
]


FUNCTIONAL_REQUIREMENT_MAP: Dict[str, List[ISOClause]] = {}
for clause in _CLAUSES:
    FUNCTIONAL_REQUIREMENT_MAP.setdefault(clause.topic, []).append(clause)


def list_functional_requirements(*topics: str) -> Iterable[ISOClause]:
    """Yield clauses that belong to the selected topics."""

    if not topics:
        return tuple(_CLAUSES)

    selected: List[ISOClause] = []
    for topic in topics:
        selected.extend(FUNCTIONAL_REQUIREMENT_MAP.get(topic, []))
    return tuple(selected)


__all__ = ["ISOClause", "FUNCTIONAL_REQUIREMENT_MAP", "list_functional_requirements"]
