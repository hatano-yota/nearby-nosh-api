import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /heart/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  const hearts = await prisma.heart.findMany({
    where: { userId: req.params?.userId },
  });
  res.json({ hearts });
});

// GET /heart/:userId/:shopId
router.get('/:userId/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.findUnique({
    where: { userId_shopId: { userId: req.params.userId, shopId: req.params.shopId } },
  });
  res.json({ hasHeart: !!heart });
});

// POST /heart/:userId/:shopId
router.post('/:userId/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.create({
    data: { userId: req.params.userId, shopId: req.params.shopId },
  });
  res.json({ heart });
});

// DELETE /heart/:userId/:shopId
router.delete('/:userId/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.delete({
    where: { userId_shopId: { userId: req.params.userId, shopId: req.params.shopId } },
  });
  res.json({ heart });
});
