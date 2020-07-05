import { Router, Request, Response } from 'express';
import AuthMiddleware from '../Middlewares/AuthMiddleware';
import AuthRoutes from './AuthRoutes';
import NewsRoutes from './NewsRoutes';
import errorMiddleware from '../Middlewares/ErrorMiddleware';

const router = Router();

router.use('/auth', AuthRoutes);

router.use(AuthMiddleware);

// A partir daqui, todas as rotas serão protegidas pelo AuthMiddleware

router.use('/news', NewsRoutes);

router.get('/hello', (req: Request, res: Response) => res.json({ hello: 'world' }));

router.use(errorMiddleware);

export default router;
