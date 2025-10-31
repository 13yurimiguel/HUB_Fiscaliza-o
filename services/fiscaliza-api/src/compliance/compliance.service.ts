import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceEvent } from '../entities/compliance-event.entity';
import { CreateComplianceEventInput } from './dto/create-compliance-event.dto';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ComplianceEvent)
    private readonly complianceRepository: Repository<ComplianceEvent>,
    private readonly messagingService: MessagingService,
  ) {}

  async recordEvent(input: CreateComplianceEventInput): Promise<ComplianceEvent> {
    const event = this.complianceRepository.create(input);
    const saved = await this.complianceRepository.save(event);
    await this.messagingService.emitEvent('compliance.events', {
      id: saved.id,
      eventType: saved.eventType,
    });
    return saved;
  }

  async findAll(): Promise<ComplianceEvent[]> {
    return this.complianceRepository.find({ order: { createdAt: 'DESC' } });
  }
}
