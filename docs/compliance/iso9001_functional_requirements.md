# Mapeamento de Cláusulas ISO 9001 para Requisitos Funcionais

O quadro abaixo traduz as cláusulas da ISO 9001 mais relevantes para documentação, rastreabilidade e auditoria
em requisitos funcionais concretos para a plataforma HUB Fiscalização.

| Cláusula | Tema | Interpretação | Requisitos Funcionais |
| --- | --- | --- | --- |
| 7.5 Informação documentada | Documentação | A organização deve estabelecer, implementar e manter informações documentadas necessárias para apoiar o SGQ. | • Repositório versionado de políticas e procedimentos.<br>• Workflow de aprovação e revisão com trilhas imutáveis.<br>• Controles de acesso granulares e registro de download/uso.
| 8.5.2 Identificação e rastreabilidade | Rastreabilidade | Produtos e evidências precisam ser identificados e vinculados ao longo do ciclo de vida. | • Cadastro de ativos auditáveis com código único.<br>• Logs imutáveis (append-only) com hash encadeado.<br>• Relacionamento entre não conformidades, ações corretivas e evidências anexas.
| 9.2 Auditoria interna | Auditoria | Auditorias devem ser planejadas, executadas e registradas. | • Plano anual de auditoria com escopo, critérios e responsáveis.<br>• Checklists customizáveis por tipo de auditoria.<br>• Relatórios estruturados com achados, classificação de risco e planos de ação.
| 9.1.1 Monitoramento, medição, análise e avaliação | Auditoria | Necessidade de medir e avaliar processos e ações corretivas. | • Indicadores de conformidade por checklist.<br>• Dashboards de progresso dos planos de ação.<br>• Alertas automatizados para prazos críticos.

Estes requisitos estão implementados no módulo `services/compliance` por meio de checklists parametrizáveis,
plano de ação e geração de relatórios com logs imutáveis e suporte a assinatura digital ICP-Brasil.
