import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { ComplianceResolver } from './compliance.resolver';
import { ComplianceEvent } from '../entities/compliance-event.entity';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceEvent]), MessagingModule],
  providers: [ComplianceService, ComplianceResolver],
  controllers: [ComplianceController],
})
export class ComplianceModule {}
