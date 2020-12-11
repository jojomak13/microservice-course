import express from 'express';
import auth from '../middlewares/auth';
import currentUser from '../middlewares/currentUser';

const router = express.Router();

router.get('/currentuser', currentUser, auth, (req, res) => {
  res.send({ user: req.user || null });
});

export { router as currentUserRouter };
