import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/new', (req: Request, res: Response) => res.json({ token: jwt.sign({ valid: true }, process.env.JWT_SECRET, { expiresIn: '1d' }) }));

export default router;
