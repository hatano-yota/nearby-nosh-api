import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';
import app from '../app';
import resetDatabase from '../utils/resetDatabase';

const prisma = new PrismaClient();

describe('rankingController test', () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /users/:userId/ranking', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      for (let i = 0; i < 3; i++) {
        for (let j = 1; j <= 3; j++) {
          await prisma.ranking.create({
            data: {
              type: `favorite${i}`,
              userId: 'test-user',
              shopId: `test-shop${j}`,
              comment: 'test-test',
              position: j,
            },
          });
        }
      }
      const rankings = await prisma.ranking.findMany();

      const response = await supertest(app).get('/users/test-user/ranking');
      expect(response.status).toBe(200);
      expect(response.body.rankings).toEqual(rankings);
    });
  });

  describe('POST /users/:userId/ranking/:type', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      const body = { shopId: 'test-shop', comment: 'test-test-test', position: 1 };
      const response = await supertest(app).post('/users/test-user/ranking/favorite1').send(body);
      expect(response.status).toBe(200);
      expect(response.body.ranking).toEqual({
        id: expect.any(String),
        type: 'favorite1',
        userId: 'test-user',
        ...body,
      });

      const rankings = await prisma.ranking.findMany();
      expect(rankings.length).toBe(1);
    });
  });

  describe('PUT /users/:userId/ranking/:type/:rankingId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      await prisma.ranking.create({
        data: {
          id: '1',
          type: 'favorite1',
          userId: 'test-user',
          shopId: 'test-shop',
          comment: 'test-test-test',
          position: 1,
        },
      });

      const body = { shopId: 'updated-shop', comment: 'update comment', position: 2 };
      const response = await supertest(app).put('/users/test-user/ranking/favorite1/1').send(body);

      expect(response.status).toBe(200);
      expect(response.body.ranking).toEqual({
        id: '1',
        type: 'favorite1',
        userId: 'test-user',
        ...body,
      });

      const after = await prisma.ranking.findUnique({ where: { id: '1' } });
      expect(after?.shopId).toEqual(body.shopId);
    });
  });

  describe('DELETE /users/:userId/ranking/:type/:rankingId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      const ranking = await prisma.ranking.create({
        data: {
          id: '1',
          type: 'favorite1',
          userId: 'test-user',
          shopId: 'test-shop',
          position: 1,
        },
      });

      const response = await supertest(app).delete('/users/test-user/ranking/favorite1/1');
      expect(response.status).toBe(200);
      expect(response.body.ranking).toEqual(ranking);

      const rankings = await prisma.ranking.findMany();
      expect(rankings.length).toBe(0);
    });
  });
});
