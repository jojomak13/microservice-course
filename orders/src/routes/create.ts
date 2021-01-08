import { Router, Request, Response } from 'express';
import {
  auth,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from '@jmtickt/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket';
import Order from '../models/Order';

const router = Router();

const EXPIRATION_TIME = 15 * 60;

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
    const { ticketId } = req.body;

    // find the ticket the user trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that this ticket is not reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket already reserved before');
    }

    // calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_TIME);

    // create new order
    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    // publish an event that order created

    res.status(201).send(order);
  }
);

export { router as CreateOrderRouter };
