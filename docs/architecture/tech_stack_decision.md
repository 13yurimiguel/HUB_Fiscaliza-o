# Decisão de Stack Tecnológica

## Objetivo
Registrar a stack recomendada para o MVP da plataforma HUB Fiscalização, cobrindo web, mobile, backend, dados, IA e infraestrutura.

## Critérios de Seleção
- **Produtividade**: ecossistemas maduros, abundância de bibliotecas e componentes UI.
- **Escalabilidade**: suporte a arquiteturas modulares/microservices, alta disponibilidade.
- **Experiência do time**: alinhada a competências comuns no mercado brasileiro.
- **Conformidade**: facilidade para atender requisitos ISO 9001, LGPD e auditorias.
- **Integrações**: interoperabilidade com serviços de IA, armazenamento e mensageria.

## Portal Web
- **Framework**: Next.js 14 (React) com App Router e TypeScript.
- **UI/UX**: Tailwind CSS + Headless UI, suportando design system responsivo e acessível.
- **Estado**: Zustand para estado local/global leve; React Query para dados da API.
- **Autenticação**: NextAuth.js com OpenID Connect (Keycloak como IdP corporativo).
- **Internacionalização**: next-intl para suportar português/inglês.
- **Testes**: Jest + React Testing Library (unitários) e Cypress (E2E no navegador).

### Justificativa
- SSR/SSG híbrido e caching facilitam dashboards com dados em tempo real.
- Ecossistema maduro e integração simples com bibliotecas de gráficos (Recharts) e editores ricos.
- NextAuth + Keycloak oferecem RBAC granular e compliance corporativa.

## Aplicativo Mobile
- **Framework**: Flutter 3.x.
- **Linguagem**: Dart com padrões BLoC/Cubit para gerenciamento de estado.
- **Pacotes principais**: `camera`, `geolocator`, `flutter_secure_storage`, `hive` (cache offline), `dio` (HTTP), `json_serializable`.
- **Teste**: Flutter Test (unitários), integration_test (fluxos críticos), golden tests para UI.

### Justificativa
- Flutter entrega UI nativa e consistente em iOS/Android com um único código.
- Forte suporte a recursos offline e plugins para sensores (GPS, câmera, EXIF).
- Comunidade ativa e fácil integração com APIs REST/GraphQL.

## Backend & Serviços
- **Gateway/API principal**: NestJS (Node.js 20) com TypeScript.
- **Comunicação**: REST + GraphQL (Apollo Federation para compor serviços quando necessário).
- **Autenticação e Autorização**: Keycloak 22 com realms/profiles específicos (admin, engenheiro, fiscal).
- **Mensageria/Eventos**: Apache Kafka (infra crítica, escalável) com schema registry (Confluent/Redpanda) para validação de payloads.
- **Storage de Arquivos**: MinIO (compatível S3) com versionamento habilitado.
- **Relatórios/Documentos**: microserviço Python (FastAPI) para geração de PDF/DOCX usando `weasyprint` e `docxtpl`.

### Justificativa
- NestJS provê modularidade, decorators para validação (class-validator) e integrações com OpenAPI.
- Kafka facilita trilhas de auditoria e processamento assíncrono (ex.: notificação, sincronização mobile).
- Separar serviço de relatórios permite escalar geração pesada isoladamente.

## Banco de Dados e Dados Analíticos
- **Relacional transacional**: PostgreSQL 15 com schemas dedicados (core, compliance, reporting).
- **Search**: Elasticsearch/OpenSearch para busca em textos de relatórios e anexos.
- **Data Warehouse**: BigQuery ou Snowflake (fase posterior) alimentado via Debezium + Kafka Connect.
- **Migrations**: Prisma ORM para serviços Node e Alembic para serviços Python.

### Justificativa
- PostgreSQL oferece recursos avançados (JSONB, RLS) para controle de acesso por obra.
- Elasticsearch otimiza busca full-text e filtros por metadados.

## IA & NLP
- **Orquestração**: FastAPI + LangChain em `services/ai-assistant`.
- **Modelos**: OpenAI GPT-4o ou Azure OpenAI; fallback opcional com modelos open-source (Llama 3) servidos via vLLM.
- **Observabilidade**: Langfuse para rastrear prompts, respostas e métricas de qualidade.
- **Segurança**: Anonimização e mascaramento antes de enviar dados ao provedor; storage cifrado para logs.

### Justificativa
- LangChain agiliza cadeias de prompts, memória e ferramentas específicas (ex.: checklist ISO).
- Langfuse fornece rastreabilidade para auditorias ISO 9001.

## Infraestrutura e DevOps
- **Cloud**: Google Cloud Platform (GCP) pela oferta equilibrada em preço e serviços gerenciados.
- **Orquestração**: Kubernetes (GKE Autopilot) com namespaces separados (dev/stage/prod).
- **CI/CD**: GitHub Actions acionando pipelines de build, testes, segurança (Snyk) e deploy via ArgoCD.
- **Observabilidade**: Stack OpenTelemetry + Grafana (Tempo/Prometheus/Loki) integrada aos serviços.
- **Infra-as-Code**: Terraform + Terragrunt com módulos versionados no diretório `infra/` (a criar).
- **Segurança**: Vault para segredos, Cloud Armor para WAF, Cloud Build triggers para escaneamento.

### Justificativa
- GKE oferece compliance ISO 9001/27001, integrações nativas com Pub/Sub, Cloud Storage e IAM.
- GitHub Actions + ArgoCD fornecem fluxo GitOps auditável.

## Próximos Passos
1. Criar ADRs detalhando decisões específicas (autenticação, mensageria, storage) em `docs/architecture/adrs/`.
2. Definir backlog de configurações Terraform para ambiente dev inicial.
3. Elaborar wireframes alinhados ao design system escolhido (Tailwind + Headless UI).
4. Planejar POC do assistente de IA com LangChain + OpenAI para validar prompts ISO.

