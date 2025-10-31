# Fiscaliza API

Serviço backend baseado em NestJS que centraliza autenticação, gestão de obras, versionamento de relatórios, gerenciamento de mídias e trilha de auditoria para o HUB Fiscalização.

## Principais características

- **NestJS + PostgreSQL** com integração TypeORM e suporte a SQLite para testes.
- APIs **REST** versionadas (URI) e **GraphQL** com validação de schemas via `class-validator`.
- **Versionamento de relatórios** com histórico completo e notificações em Kafka.
- **Upload de mídias** com extração de metadados EXIF, geração de hash criptográfico e armazenamento em S3/MinIO.
- **Compliance e auditoria** com geração de eventos e instrumentação OpenTelemetry.
- **Mensageria** baseada em Kafka (pode ser adaptada para RabbitMQ) para sincronização mobile e alertas.
- **Testes E2E** com Jest e Supertest cobrindo fluxos críticos de autenticação, relatórios e mídias.

## Executando o projeto

```bash
npm install
npm run start:dev
```

### Variáveis de ambiente relevantes

- `DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_REGION`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, `STORAGE_FORCE_PATH_STYLE`
- `KAFKA_BROKERS`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`, `KAFKA_ENABLED`
- `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`

## Testes

```bash
npm run test:e2e
```
