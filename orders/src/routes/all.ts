import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send('index route');
});

export { router as IndexOrderRouter };
