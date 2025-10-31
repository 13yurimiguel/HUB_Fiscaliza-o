import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateRelatorioInput } from './dto/create-relatorio.dto';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly messagingService: MessagingService,
  ) {}

  async createVersion(input: CreateRelatorioInput): Promise<Report> {
    const lastVersion = await this.reportRepository.findOne({
      where: { reportCode: input.reportCode },
      order: { version: 'DESC' },
    });
    const nextVersion = (lastVersion?.version ?? 0) + 1;
    const report = this.reportRepository.create({
      ...input,
      version: nextVersion,
    });
    const saved = await this.reportRepository.save(report);

    await this.messagingService.emitEvent('relatorios.versioned', {
      reportCode: saved.reportCode,
      version: saved.version,
    });

    return saved;
  }

  async findLatest(reportCode: string): Promise<Report | null> {
    return this.reportRepository.findOne({
      where: { reportCode },
      order: { version: 'DESC' },
    });
  }

  async findHistory(reportCode: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { reportCode },
      order: { version: 'DESC' },
    });
  }
}
