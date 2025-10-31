import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { Obra } from '../entities/obra.entity';
import { MediaAsset } from '../entities/media-asset.entity';
import { User } from '../entities/user.entity';
import { ComplianceEvent } from '../entities/compliance-event.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfig = this.configService.get('database');
    const isSqlite = databaseConfig.type === 'sqlite';

    return {
      type: databaseConfig.type,
      host: isSqlite ? undefined : databaseConfig.host,
      port: isSqlite ? undefined : databaseConfig.port,
      username: isSqlite ? undefined : databaseConfig.username,
      password: isSqlite ? undefined : databaseConfig.password,
      database: databaseConfig.database,
      entities: [Report, Obra, MediaAsset, User, ComplianceEvent],
      synchronize: true,
      logging: false,
    } as TypeOrmModuleOptions;
  }
}
