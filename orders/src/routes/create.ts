import { Router, Request, Response } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  res.send('create route');
});

export { router as CreateOrderRouter };
