import { NotFoundError } from '@jmtickt/common';
import { Router, Request, Response } from 'express';
import Ticket from '../models/Ticket';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as ShowTicketRouter };
