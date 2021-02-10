import express from 'express';
import { currentUser, auth } from '@jmtickt/common';

const router = express.Router();

router.get('/currentuser', currentUser, (req, res) => {
  res.send({ user: req.user || null });
});

export { router as currentUserRouter };
