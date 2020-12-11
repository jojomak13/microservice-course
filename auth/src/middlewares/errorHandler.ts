import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/CutsomError';

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send(error.serialize());
  }

  return res.status(400).send({
    type: 'UnhandeledError',
    errors: [{ message: 'Something went wrong' }],
  });
};

export { errorHandler };
