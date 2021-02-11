import { auth, currentUser } from '@jmtickt/common';
import { Router, Request, Response } from 'express';
import Order from '../models/Order';

const router = Router();

router.get('/', auth, currentUser, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  })
    .populate('ticket')
    .sort({ _id: 'desc' })
    .exec();

  res.send(orders);
});

export { router as IndexOrderRouter };
