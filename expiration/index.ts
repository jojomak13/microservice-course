import { OrderCreatedListener } from './src/events/listeners/OrderCreatedListener';
import { natsWrapper } from './src/natsWrapper';

const start = async () => {
  const envKeys = [
    'NATS_CLUSTER_ID',
    'NATS_CLIENT_ID',
    'NATS_URL',
    'REDIS_HOST',
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
