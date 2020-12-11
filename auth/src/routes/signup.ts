import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import BadRequestError from '../errors/BadRequestError';
import validateRequest from '../middlewares/validateRequest';
import User from '../models/User';

const router: Router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be more than 6 chracters.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new BadRequestError('Email Already Exists');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT in session
    req.session = { jwt: jwtToken };

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
