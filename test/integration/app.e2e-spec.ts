import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Transaction API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: false,
        whitelist: true,
        stopAtFirstError: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/transactions (POST)', () => {
    it('should create transaction successfully', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          amount: 100.5,
          timestamp: '2025-07-16T20:00:00.000Z',
        })
        .expect(201);
    });

    it('should reject future transaction', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          amount: 100.5,
          timestamp: futureDate.toISOString(),
        })
        .expect(422);
    });

    it('should reject negative amount', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          amount: -50.0,
          timestamp: '2025-07-16T20:00:00.000Z',
        })
        .expect(400);
    });
  });

  describe('/transactions (DELETE)', () => {
    it('should delete all transactions', () => {
      return request(app.getHttpServer()).delete('/transactions').expect(200);
    });
  });

  describe('/statistics (GET)', () => {
    it('should return zero statistics when no transactions', () => {
      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect({
          count: 0,
          sum: 0,
          avg: 0,
          min: 0,
          max: 0,
        });
    });

    it('should calculate statistics correctly', async () => {
      // Criar algumas transações recentes
      const now = new Date();
      const timestamp1 = new Date(now.getTime() - 30000).toISOString(); // 30s atrás
      const timestamp2 = new Date(now.getTime() - 20000).toISOString(); // 20s atrás

      await request(app.getHttpServer())
        .post('/transactions')
        .send({ amount: 100, timestamp: timestamp1 });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({ amount: 50, timestamp: timestamp2 });

      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body.count).toBe(2);
          expect(res.body.sum).toBe(150);
          expect(res.body.avg).toBe(75);
          expect(res.body.min).toBe(50);
          expect(res.body.max).toBe(100);
        });
    });
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
          expect(res.body.uptime).toBeGreaterThan(0);
        });
    });
  });
});
