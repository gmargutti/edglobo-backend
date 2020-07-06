import {
  Router, Request, Response, NextFunction,
} from 'express';
import NewsController from '../Controllers/NewsController';
import app from '../app';
import News from '../@types/News';

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

router.get('/:newsId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newsId } = req.params;
    const controller = new NewsController(app.Repositories.NewsRepository);
    const news = await controller.read(newsId);
    return res.json(news);
  } catch (err) {
    return next(err);
  }
});

router.put('/:newsId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newsId } = req.params;
    const news = { ...req.body } as News;
    const controller = new NewsController(app.Repositories.NewsRepository);
    const updated = await controller.update(newsId, news);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:newsId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newsId } = req.params;
    const controller = new NewsController(app.Repositories.NewsRepository);
    const deleted = await controller.delete(newsId);
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

export default router;
