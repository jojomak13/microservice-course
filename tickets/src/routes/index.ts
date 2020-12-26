import { Router } from 'express';
import { createTicketRouter } from './create';

const router: Router = Router();
router.use('/tickets', createTicketRouter);

export default router;
