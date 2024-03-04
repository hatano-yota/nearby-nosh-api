import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /users
router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

// GET /users/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params?.userId },
  });
  res.json({ user });
});

// POST /users
router.post('/', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email },
  });
  res.json({ user });
});

// PUT /users/:userId
router.put('/:userId', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params?.userId },
    data: { name, email },
  });
  res.json({ user });
});

// DELETE /users/:userId
router.delete('/:userId', async (req: Request, res: Response) => {
  const user = await prisma.user.delete({
    where: { id: req.params?.userId },
  });
  res.json({ user });
});

export default router;
