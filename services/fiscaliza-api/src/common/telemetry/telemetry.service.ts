import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ConfigService } from '@nestjs/config';

export class TelemetryService {
  private sdk: NodeSDK | null = null;
  private readonly configService = new ConfigService();

  async start(): Promise<void> {
    const telemetry =
      this.configService.get('telemetry') ??
      ({
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'fiscaliza-api',
        endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318',
      } as const);

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const exporter = new OTLPTraceExporter({
      url: `${telemetry.endpoint}/v1/traces`,
    });

    this.sdk = new NodeSDK({
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: telemetry.serviceName,
      }),
    });

    await this.sdk.start();
  }

  async shutdown(): Promise<void> {
    if (this.sdk) {
      await this.sdk.shutdown();
      this.sdk = null;
    }
  }
}
