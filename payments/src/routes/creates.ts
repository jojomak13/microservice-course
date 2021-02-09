import {
  auth,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from '@jmtickt/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import Order from '../models/Order';
import { stripe } from '../stripe';

const router: Router = Router();

router.post(
  '/',
  auth,
  [
    body('token').not().isEmpty().withMessage('Token is required.'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
      throw new BadRequestError('not authorized', 401);
    }

    if (order.status === OrderStatus.Canelled) {
      throw new BadRequestError('cannot pay for cancel order');
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.status(201).json({ success: true });
  }
);

export { router as CreateChargeRoute };
