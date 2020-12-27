import { auth, validateRequest } from '@jmtickt/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import Ticket from '../models/Ticket';

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
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    let ticket = Ticket.build({ title, price, userId: req.user!.id });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
