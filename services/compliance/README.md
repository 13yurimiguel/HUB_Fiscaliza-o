# Compliance Service Toolkit

Este módulo fornece utilitários para operacionalizar requisitos de conformidade derivados da ISO 9001 e da LGPD.

## Componentes Principais
- `iso9001`: Mapeamento de cláusulas ISO 9001 para requisitos funcionais.
- `checklists`: Construção de checklists auditáveis com status e evidências.
- `action_plans`: Gestão de ações corretivas e acompanhamento de prazos.
- `audit`: Geração de relatórios de auditoria com métricas e achados.
- `immutable_log`: Trilhas de auditoria imutáveis (append-only) com hash encadeado.
- `digital_signature`: Integração com certificados ICP-Brasil para assinatura digital.
- `lgpd`: Políticas de consentimento, criptografia KMS e anonimização para treino de IA.

## Exemplo de Uso
```python
from datetime import date

from services.compliance import (
    Checklist, ChecklistItem, ChecklistStatus,
    ActionPlan, ActionItem, ActionStatus,
    AuditReportBuilder, ImmutableAuditLog,
)

checklist = Checklist(name="Auditoria Interna - Processos")
checklist.add_item(ChecklistItem("DOC-01", "7.5", "Documentação aprovada e versionada?"))
checklist.mark_item("DOC-01", ChecklistStatus.COMPLIANT, evidence="Manual de qualidade v1.2")

action_plan = ActionPlan(name="Correções 2024", description="Plano para não conformidades críticas")
action_plan.add_item(ActionItem(
    identifier="AC-01",
    title="Revisar controle de acesso",
    owner="Equipe Segurança",
    due_date=date(2024, 6, 30),
))

report = (
    AuditReportBuilder(checklist, scope="Processos internos", auditor="Maria Souza")
    .derive_findings()
    .compute_metrics()
    .build(title="Auditoria ISO 9001 - Abril/2024", action_plan=action_plan)
)

log = ImmutableAuditLog("/var/log/hub_fiscalizacao/audit.log")
log.append(actor="auditor:maria", action="audit_report_generated", payload={"title": report.title})
```

## Dependências
Instale os requisitos específicos do módulo com:

```bash
pip install -r services/compliance/requirements.txt
```

> Recomenda-se habilitar HSM ou KMS compatível com ICP-Brasil ao utilizar o módulo de assinatura digital.
