import { Router, Request, Response } from 'express';

const router = Router();

router.delete('/:orderId', async (req: Request, res: Response) => {
  res.send('delete route');
});

export { router as DeleteOrderRouter };
