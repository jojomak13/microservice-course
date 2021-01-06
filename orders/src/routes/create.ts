import { Router, Request, Response } from 'express';
import { auth, validateRequest } from '@jmtickt/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = Router();

router.post(
  '/',
  auth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send('create route');
  }
);

export { router as CreateOrderRouter };
