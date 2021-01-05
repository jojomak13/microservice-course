import { Router, Request, Response } from 'express';

const router = Router();

router.get('/:orderId', async (req: Request, res: Response) => {
  res.send('show route');
});

export { router as ShowOrderRouter };
