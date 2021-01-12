import {
  auth,
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
} from '@jmtickt/common';
import { Router, Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/OrderCancelledPublisher';
import Order from '../models/Order';
import { natsWrapper } from '../natsWrapper';

const router = Router();

router.delete(
  '/:orderId',
  auth,
  currentUser,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new BadRequestError('not authorized', 401);
    }

    order.status = OrderStatus.Canelled;
    await order.save();

    // publish an event that order cancelled
    // new OrderCancelledPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   ticket: {
    //     id: order.ticket.id,
    //   },
    // });

    res.status(204).send(order);
  }
);

export { router as DeleteOrderRouter };
