import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /users/:userId/ranking
router.get('/:userId/ranking', async (req: Request, res: Response) => {
  const rankings = await prisma.ranking.findMany({
    where: { userId: req.params.userId },
  });
  res.json({ rankings });
});

// POST /users/:userId/ranking/:type
router.post('/:userId/ranking/:type', async (req: Request, res: Response) => {
  const { shopId, comment, position } = req.body;
  const ranking = await prisma.ranking.create({
    data: { type: req.params.type, userId: req.params.userId, shopId, comment, position },
  });
  res.json({ ranking });
});

// PUT /users/:userId/ranking/:type/:rankingId
router.put('/:userId/ranking/:type/:rankingId', async (req: Request, res: Response) => {
  const { shopId } = req.body;
  const ranking = await prisma.ranking.update({
    where: { id: req.params.rankingId },
    data: { shopId },
  });
  res.json({ ranking });
});

// Delete /users/:userId/ranking/:type/:rankingId
router.delete('/:userId/ranking/:type/:rankingId', async (req: Request, res: Response) => {
  const ranking = await prisma.ranking.delete({
    where: { id: req.params.rankingId },
  });
  res.json({ ranking });
});

export default router;
