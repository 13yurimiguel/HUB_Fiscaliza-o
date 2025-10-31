import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('Fiscaliza API (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    const passwordHash = await bcrypt.hash('secret123', 10);
    await userRepository.save({ email: 'auditor@example.com', passwordHash, role: 'AUDITOR' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('autentica usuário e retorna token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email: 'auditor@example.com', password: 'secret123' })
      .expect(201);

    expect(response.body.token).toBeDefined();
  });

  it('versiona relatórios mantendo histórico', async () => {
    await request(app.getHttpServer())
      .post('/v1/relatorios')
      .send({ reportCode: 'R-001', payload: { status: 'draft' } })
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/relatorios')
      .send({ reportCode: 'R-001', payload: { status: 'final' } })
      .expect(201);

    const latest = await request(app.getHttpServer()).get('/v1/relatorios/R-001').expect(200);
    expect(latest.body.version).toBe(2);
    expect(latest.body.payload).toEqual({ status: 'final' });

    const history = await request(app.getHttpServer())
      .get('/v1/relatorios/R-001/historico')
      .expect(200);

    expect(history.body).toHaveLength(2);
    expect(history.body.map((item: any) => item.version)).toEqual([2, 1]);
  });

  it('armazena mídias com hash e metadados', async () => {
    const sampleImage = Buffer.from('test-image').toString('base64');

    const upload = await request(app.getHttpServer())
      .post('/v1/midias/upload')
      .send({ filename: 'imagem.txt', data: sampleImage, contentType: 'text/plain' })
      .expect(201);

    expect(upload.body.storageKey).toBeDefined();
    expect(upload.body.hash).toBeDefined();
  });
});
