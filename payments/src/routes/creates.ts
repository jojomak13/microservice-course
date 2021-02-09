import {
  auth,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from '@jmtickt/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher';
import Order from '../models/Order';
import Payment from '../models/Payment';
import { natsWrapper } from '../natsWrapper';
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

    const stripeCharge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: stripeCharge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ id: payment!.id });
  }
);

export { router as CreateChargeRoute };
