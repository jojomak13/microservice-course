import { auth, validateRequest } from '@jmtickt/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher';
import Ticket from '../models/Ticket';
import { natsWrapper } from '../natsWrapper';

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

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
