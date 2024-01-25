import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';
import app from '../app';
import resetDatabase from '../utils/resetDatabase';

const prisma = new PrismaClient();

describe('heartController test', () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /heart/:userId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      for (let i = 0; i < 3; i++) {
        await prisma.heart.create({
          data: { id: `${i}`, userId: 'test-user', shopId: `shop${i}` },
        });
      }
      const hearts = await prisma.heart.findMany();

      const response = await supertest(app).get('/heart/test-user');
      expect(response.status).toBe(200);
      expect(response.body.hearts).toEqual(hearts);
    });
  });

  describe('GET /heart/:userId/:shopId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      await prisma.heart.create({
        data: { id: '1', userId: 'test-user', shopId: 'test-shop' },
      });
      const heart = await prisma.heart.findUnique({
        where: { userId_shopId: { userId: 'test-user', shopId: 'test-shop' } },
      });
      const hasHeart = !!heart;

      const response = await supertest(app).get('/heart/test-user/test-shop');
      expect(response.status).toBe(200);
      expect(response.body.hasHeart).toEqual(hasHeart);
    });
  });

  describe('POST /heart/:userId/:shopId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      const body = { userId: 'test-user', shopId: 'test-shop' };
      const response = await supertest(app).post('/heart/test-user/test-shop');
      expect(response.status).toBe(200);
      expect(response.body.heart.userId).toEqual(body.userId);
      expect(response.body.heart.shopId).toEqual(body.shopId);

      const hearts = await prisma.heart.findMany();
      expect(hearts.length).toBe(1);
    });
  });

  describe('DELETE /heart/:userId/:shopId', () => {
    test('response with success', async () => {
      await prisma.user.create({
        data: { id: 'test-user', name: 'tester', email: 'test@gmail.com' },
      });
      const heart = await prisma.heart.create({
        data: { id: '1', userId: 'test-user', shopId: 'test-shop' },
      });

      const response = await supertest(app).delete('/heart/test-user/test-shop');
      expect(response.status).toBe(200);
      expect(response.body.heart).toEqual(heart);

      const hearts = await prisma.heart.findMany();
      expect(hearts.length).toEqual(0);
    });
  });
});
