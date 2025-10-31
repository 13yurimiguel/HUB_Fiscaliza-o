import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private readonly enabled: boolean;
  private producer: Producer | null = null;

  constructor(private readonly configService: ConfigService) {
    const kafkaConfig = this.configService.get('kafka');
    this.enabled = kafkaConfig.enabled;

    if (this.enabled) {
      const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers,
      });
      this.producer = kafka.producer({ allowAutoTopicCreation: true });
      this.producer.connect().catch((err) => {
        this.logger.error('Failed to connect Kafka producer', err);
      });
    }
  }

  async emitEvent(topic: string, payload: Record<string, any>): Promise<void> {
    if (!this.enabled || !this.producer) {
      this.logger.debug(`Kafka disabled, skipping event ${topic}`);
      return;
    }

    await this.producer.send({
      topic,
      messages: [{
        key: payload?.id ?? undefined,
        value: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      }],
    });
  }
}
