import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const [, token] = req.headers.authorization.split('Bearer ');
    if (!token) {
      return res.status(400).json({ message: 'O token deve ser informado obrigatoriamente' });
    }
    try {
      const infoJwt = jwt.verify(token, process.env.JWT_SECRET);
      req.infoJwt = infoJwt;
      return next();
    } catch (err) {
      return res.status(400).json({ message: 'Token informado não é válido!' });
    }
  }
  return res.status(400).json({ message: 'O token deve ser informado obrigatoriamente' });
}
