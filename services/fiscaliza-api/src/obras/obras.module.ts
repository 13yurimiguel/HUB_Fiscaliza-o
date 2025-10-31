import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasService } from './obras.service';
import { ObrasController } from './obras.controller';
import { ObrasResolver } from './obras.resolver';
import { Obra } from '../entities/obra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Obra])],
  providers: [ObrasService, ObrasResolver],
  controllers: [ObrasController],
  exports: [ObrasService],
})
export class ObrasModule {}
