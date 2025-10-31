import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private readonly client: S3 | null;
  private readonly bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const storage = this.configService.get('storage');
    this.bucket = storage.bucket;

    if (process.env.NODE_ENV === 'test' || !storage.endpoint) {
      this.client = null;
      return;
    }

    this.client = new S3({
      endpoint: storage.endpoint,
      region: storage.region,
      credentials: storage.accessKeyId
        ? {
            accessKeyId: storage.accessKeyId,
            secretAccessKey: storage.secretAccessKey,
          }
        : undefined,
      s3ForcePathStyle: storage.forcePathStyle,
      signatureVersion: 'v4',
    });
  }

  async upload(buffer: Buffer, filename: string, contentType: string): Promise<string> {
    const key = `${uuid()}-${filename}`;
    if (!this.client) {
      this.logger.debug(`Storage client not configured, skipping upload for ${key}`);
      return key;
    }

    await this.client
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
      .promise();
    return key;
  }
}
