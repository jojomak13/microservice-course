import { Router } from 'express';
import { createTicketRouter } from './create';
import { ShowTicketRouter } from './show';

const router: Router = Router();
router.use('/tickets', createTicketRouter);
router.use('/tickets', ShowTicketRouter);

export default router;
