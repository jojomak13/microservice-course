import { auth, validateRequest } from '@jmtickt/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router: express.Router = express.Router();

router.post(
  '/',
  auth,
  [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0.'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

export { router as createTicketRouter };
