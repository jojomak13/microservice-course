import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@jmtickt/common';
import router from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Register Router
app.use('/api', router);

// Not Found Route
app.use(() => {
  throw new NotFoundError();
});

// Register Error Handler
app.use(errorHandler);

export default app;
