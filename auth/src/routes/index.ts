import express from 'express';
import { currentUserRouter } from './current-user';
import { loginRouter } from './login';
import { logoutRouter } from './logout';
import { signupRouter } from './signup';

const router = express.Router();

router.use('/users', currentUserRouter);
router.use('/users', loginRouter);
router.use('/users', logoutRouter);
router.use('/users', signupRouter);

export default router;
