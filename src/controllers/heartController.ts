import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /users/:userId/hearts
router.get('/:userId/hearts', async (req: Request, res: Response) => {
  const hearts = await prisma.heart.findMany({
    where: { userId: req.params?.userId },
  });
  res.json({ hearts });
});

// GET /users/:userId/hearts/:shopId
router.get('/:userId/hearts/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.findUnique({
    where: { userId_shopId: { userId: req.params.userId, shopId: req.params.shopId } },
  });
  res.json({ hasHeart: !!heart });
});

// POST /users/:userId/hearts/:shopId
router.post('/:userId/hearts/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.create({
    data: { userId: req.params.userId, shopId: req.params.shopId },
  });
  res.json({ heart });
});

// DELETE /users/:userId/hearts/:shopId
router.delete('/:userId/hearts/:shopId', async (req: Request, res: Response) => {
  const heart = await prisma.heart.delete({
    where: { userId_shopId: { userId: req.params.userId, shopId: req.params.shopId } },
  });
  res.json({ heart });
});

export default router;
