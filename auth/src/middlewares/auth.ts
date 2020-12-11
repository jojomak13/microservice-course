import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/BadRequestError';

export default (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new BadRequestError('Not Authorized', 401);
  }

  return next();
};
