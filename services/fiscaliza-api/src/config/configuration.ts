export const configuration = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    type: process.env.DB_TYPE ?? 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'fiscaliza',
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT,
    bucket: process.env.STORAGE_BUCKET ?? 'fiscaliza-midias',
    region: process.env.STORAGE_REGION ?? 'us-east-1',
    accessKeyId: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'fiscaliza-api',
    groupId: process.env.KAFKA_GROUP_ID ?? 'fiscaliza-consumers',
    enabled: process.env.KAFKA_ENABLED !== 'false',
  },
  telemetry: {
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'fiscaliza-api',
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318',
  },
});
