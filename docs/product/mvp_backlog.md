# Backlog Inicial Prioritizado — MVP HUB Fiscalização

## Objetivo do MVP
Focar no registro diário de obras com suporte de IA básico e exportação de relatórios em PDF, garantindo sincronização entre web e mobile e conformidade mínima com ISO 9001.

## Legendagem
- **Prioridade**: P0 (crítico), P1 (importante), P2 (desejável)
- **Estimativa**: em sprints de 2 semanas (SP = Story Points considerando time de 5 pessoas)
- **Dependências**: itens que devem ser entregues antes

## Roadmap das Próximas 3 Sprints

| Sprint | Objetivos-Chave |
| --- | --- |
| Sprint 1 | Fundamentos de autenticação, cadastro de obras, diário básico no mobile com sincronização inicial e geração de PDF manual. |
| Sprint 2 | Relatórios customizáveis no web dashboard, IA assistente básica, exportação PDF automatizada com modelos. |
| Sprint 3 | Refinamentos ISO 9001, fluxos de aprovação e melhorias de usabilidade web/mobile. |

## Backlog Prioritizado

### P0 — Infraestrutura Fundamental e Diário de Obra
| ID | Item | Descrição | Estimativa | Dependências |
| --- | --- | --- | --- | --- |
| P0.1 | Autenticação e RBAC inicial | Implementar login unificado (SSO) e perfis (engenheiro, fiscal) em web/mobile | 8 SP (Sprint 1) | - |
| P0.2 | Cadastro e gestão de obras | Criar endpoints e UI para criar/editar obras, equipes e atividades relacionadas | 13 SP (Sprint 1) | P0.1 |
| P0.3 | Diário de obra mobile (offline-first) | Desenvolver fluxo de criação de diário, captura de fotos com metadados, armazenamento local e sincronização básica | 21 SP (Sprint 1) | P0.1, P0.2 |
| P0.4 | API de sincronização e armazenamento | Disponibilizar serviços para subir mídias, metadados e entradas textuais; persistir em banco e storage S3 compatível | 13 SP (Sprint 1) | P0.1, P0.2 |
| P0.5 | Exportação PDF inicial | Geração de relatório PDF simples (modelo fixo) com dados do diário e fotos | 8 SP (Sprint 1) | P0.3, P0.4 |

### P1 — IA Assistente Básica e Editor de Relatórios
| ID | Item | Descrição | Estimativa | Dependências |
| --- | --- | --- | --- | --- |
| P1.1 | Editor web de relatórios | Construir UI web para montar relatórios customizáveis com blocos e anexos | 21 SP (Sprint 2) | P0.2, P0.4 |
| P1.2 | Assistente de IA contextual | Integrar agente LLM com contexto da obra para sugerir textos e correções | 13 SP (Sprint 2) | P0.4 |
| P1.3 | Inserção de sugestões IA no editor | Permitir que o usuário aceite/edite sugestões diretamente no relatório | 8 SP (Sprint 2) | P1.1, P1.2 |
| P1.4 | Exportação PDF avançada | Suportar templates e geração automatizada via editor web | 13 SP (Sprint 2) | P1.1, P0.5 |
| P1.5 | Painel de acompanhamento | Dashboard com status dos diários, pendências e notificações básicas | 8 SP (Sprint 2) | P0.2 |

### P2 — Conformidade ISO 9001 e Refinamentos
| ID | Item | Descrição | Estimativa | Dependências |
| --- | --- | --- | --- | --- |
| P2.1 | Checklists ISO configuráveis | Criar módulo para definir campos obrigatórios, validações e anexos por tipo de relatório | 13 SP (Sprint 3) | P1.1 |
| P2.2 | Fluxo de aprovação e auditoria | Implementar revisão/assinatura digital e trilha de auditoria consultável | 13 SP (Sprint 3) | P2.1 |
| P2.3 | Notificações e alertas | Enviar alertas (email/push) para diários pendentes e não conformidades | 8 SP (Sprint 3) | P0.5 |
| P2.4 | UX refinements e acessibilidade | Ajustes de usabilidade web/mobile, suporte multi-idioma e acessibilidade básica | 8 SP (Sprint 3) | P0.3, P1.1 |
| P2.5 | Métricas e observabilidade | Dashboards técnicos (logs, telemetria) e monitoramento de performance | 5 SP (Sprint 3) | P0.4 |

## Itens de Suporte Contínuo
- **Documentação e treinamento** (5 SP por sprint): atualizar guias de uso, tutoriais ISO e material de onboarding.
- **Qualidade e testes automatizados** (8 SP por sprint): ampliar cobertura de testes, pipelines CI/CD e revisão de segurança.

## Riscos e Mitigações
1. **Disponibilidade do modelo de IA**: avaliar contingência com modelo on-premise caso SaaS apresente instabilidade.
2. **Latência na sincronização mobile**: priorizar testes em campo e otimizar upload de mídia (compressão, fila assíncrona).
3. **Aderência ISO 9001**: envolver especialista de qualidade nas revisões das sprints para garantir cumprimento dos requisitos.

