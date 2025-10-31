import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MidiasService } from './midias.service';
import { MidiasController } from './midias.controller';
import { MidiasResolver } from './midias.resolver';
import { MediaAsset } from '../entities/media-asset.entity';
import { StorageModule } from '../storage/storage.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset]), StorageModule, MessagingModule],
  providers: [MidiasService, MidiasResolver],
  controllers: [MidiasController],
})
export class MidiasModule {}
