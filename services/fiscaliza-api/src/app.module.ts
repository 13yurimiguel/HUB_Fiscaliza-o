import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ObrasModule } from './obras/obras.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { MidiasModule } from './midias/midias.module';
import { ComplianceModule } from './compliance/compliance.module';
import { StorageModule } from './storage/storage.module';
import { MessagingModule } from './messaging/messaging.module';
import { configuration } from './config/configuration';
import { DatabaseConfigService } from './config/database-config.service';
import { Report } from './entities/report.entity';
import { Obra } from './entities/obra.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { User } from './entities/user.entity';
import { ComplianceEvent } from './entities/compliance-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      path: '/graphql',
    }),
    TypeOrmModule.forFeature([Report, Obra, MediaAsset, User, ComplianceEvent]),
    StorageModule,
    MessagingModule,
    AuthModule,
    ObrasModule,
    RelatoriosModule,
    MidiasModule,
    ComplianceModule,
  ],
})
export class AppModule {}
