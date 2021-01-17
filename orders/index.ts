import mongoose from 'mongoose';
import app from './src/app';
import { TicketCreatedListener } from './src/events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './src/events/listeners/TicketUpdatedListener';
import { natsWrapper } from './src/natsWrapper';

const start = async () => {
  const envKeys = [
    'JWT_KEY',
    'MONGO_URI',
    'NATS_CLUSTER_ID',
    'NATS_CLIENT_ID',
    'NATS_URL',
  ];

  for (let key of envKeys) {
    if (!process.env[key]) {
      throw new Error(`[${key}] not found`);
    }
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    console.log('[info] nats connection open.');

    natsWrapper.client.on('colse', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!, {
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
    console.log(`[Orders Service] Running on port ${port}`);
  });
};

start();
