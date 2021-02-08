import { Router } from 'express';
import { CreateChargeRoute } from './creates';

const router: Router = Router();
router.use('/payments', CreateChargeRoute);

export default router;
