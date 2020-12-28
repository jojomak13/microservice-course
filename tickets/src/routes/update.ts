import {
  auth,
  BadRequestError,
  NotFoundError,
  validateRequest,
} from '@jmtickt/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import Ticket from '../models/Ticket';

const router = Router();

router.put(
  '/:id',
  auth,
  [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId != req.user!.id) {
      throw new BadRequestError('Not Authorized', 401);
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    res.send(ticket);
  }
);

export { router as UpdateTicketRouter };
