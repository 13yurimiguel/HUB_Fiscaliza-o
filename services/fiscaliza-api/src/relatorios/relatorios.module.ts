import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosResolver } from './relatorios.resolver';
import { Report } from '../entities/report.entity';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), MessagingModule],
  providers: [RelatoriosService, RelatoriosResolver],
  controllers: [RelatoriosController],
  exports: [RelatoriosService],
})
export class RelatoriosModule {}
