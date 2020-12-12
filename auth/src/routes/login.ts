import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import BadRequestError from '../errors/BadRequestError';
import validateRequest from '../middlewares/validateRequest';
import User from '../models/User';
import Password from '../services/Password';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password').trim().notEmpty().withMessage('Password is required.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid Credentials');
    }

    const isValid = await Password.compare(user.password, password);

    if (!isValid) {
      throw new BadRequestError('Invalid Credentials');
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT in session
    req.session = { jwt: jwtToken };

    return res.status(200).send({ token: jwtToken });
  }
);

export { router as loginRouter };
