import { NextFunction, Request, Response } from 'express';

export default function initMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return next();
}
