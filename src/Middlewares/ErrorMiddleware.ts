import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.name === 'CUSTOM_ERROR' || 'CastError') {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Não foi possível concluir a requisição!' });
}
