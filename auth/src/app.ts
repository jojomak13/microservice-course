import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import NotFoundError from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
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
