import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from '../entities/media-asset.entity';
import { UploadMidiaInput } from './dto/upload-midia.dto';
import { StorageService } from '../storage/storage.service';
import { MessagingService } from '../messaging/messaging.service';
import { createHash } from 'crypto';
import * as exifr from 'exifr';

@Injectable()
export class MidiasService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly midiasRepository: Repository<MediaAsset>,
    private readonly storageService: StorageService,
    private readonly messagingService: MessagingService,
  ) {}

  async upload(input: UploadMidiaInput): Promise<MediaAsset> {
    const buffer = Buffer.from(input.data, 'base64');
    const metadata = await this.extractMetadata(buffer);
    const hash = createHash('sha256').update(buffer).digest('hex');
    const storageKey = await this.storageService.upload(
      buffer,
      input.filename,
      input.contentType ?? 'application/octet-stream',
    );

    const media = this.midiasRepository.create({
      filename: input.filename,
      storageKey,
      metadata,
      hash,
    });

    const saved = await this.midiasRepository.save(media);
    await this.messagingService.emitEvent('midias.uploaded', {
      mediaId: saved.id,
      storageKey: saved.storageKey,
    });

    return saved;
  }

  private async extractMetadata(buffer: Buffer): Promise<Record<string, any> | undefined> {
    try {
      const exif = await exifr.parse(buffer);
      return exif ?? undefined;
    } catch (error) {
      return undefined;
    }
  }
}
