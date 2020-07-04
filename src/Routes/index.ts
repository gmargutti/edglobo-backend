import { Router, Request, Response } from 'express';
import AuthMiddleware from '../Middlewares/AuthMiddleware';
import AuthRoutes from './AuthRoutes';

const router = Router();

router.use('/auth', AuthRoutes);

router.use(AuthMiddleware);

router.get('/hello', (req: Request, res: Response) => res.json({ hello: 'world' }));

export default router;
