import { Router } from 'express';
import { IndexTicketRouter } from './all';
import { createTicketRouter } from './create';
import { ShowTicketRouter } from './show';
import { UpdateTicketRouter } from './update';

const router: Router = Router();
router.use('/tickets', createTicketRouter);
router.use('/tickets', ShowTicketRouter);
router.use('/tickets', IndexTicketRouter);
router.use('/tickets', UpdateTicketRouter);

export default router;
