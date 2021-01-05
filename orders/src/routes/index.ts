import { Router } from 'express';
import { IndexOrderRouter } from './all';
import { CreateOrderRouter } from './create';
import { DeleteOrderRouter } from './delete';
import { ShowOrderRouter } from './show';

const router: Router = Router();
router.use('/orders', IndexOrderRouter);
router.use('/orders', CreateOrderRouter);
router.use('/orders', DeleteOrderRouter);
router.use('/orders', ShowOrderRouter);

export default router;
