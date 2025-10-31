process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite';
process.env.DB_DATABASE = ':memory:';
process.env.KAFKA_ENABLED = 'false';
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:4318';
