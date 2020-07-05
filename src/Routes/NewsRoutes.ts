import {
  Router, Request, Response, NextFunction,
} from 'express';
import NewsController from '../Controllers/NewsController';
import app from '../app';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new NewsController(app.Repositories.NewsRepository);
    const { titulo, conteudo, dataPublicacao } = req.body;
    const inserted = await controller.create({ titulo, conteudo, dataPublicacao });
    return res.json(inserted);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new NewsController(app.Repositories.NewsRepository);
    const news = await controller.read();
    return res.json(news);
  } catch (err) {
    return next(err);
  }
});

export default router;
