import mongoose from 'mongoose';
import app from './src/app';
import { natsWrapper } from './src/natsWrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('[JWT_KEY] not found');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('[MONGO_URI] not found');
  }

  try {
    await natsWrapper.connect(
      'ticketing',
      'sdfsfd',
      'http://nats-service:4222'
    );
    console.log('[info] nats connection open.');

    natsWrapper.client.on('colse', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('[info] DB connection open.');
  } catch (err) {
    console.log(err);
  }

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`[Auth Service] Running on port ${port}`);
  });
};

start();
