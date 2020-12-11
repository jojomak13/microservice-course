import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// An interface for user jwt payload
interface UserPayload {
  id: string;
  email: string;
}

// Assign the user payload to
// express request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export default (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.user = payload;
    return next();
  } catch (err) {}

  return next();
};
