import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
  req.session = null;
  res.send({});
});

export { router as logoutRouter };
