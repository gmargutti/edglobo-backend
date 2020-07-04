import { Router, Request, Response } from 'express';

const router = Router();

router.get('/hello', (req: Request, res: Response) => res.json({ hello: 'world' }));

export default router;
