import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscribtion = stan.subscribe(
    'ticket:created',
    'order-service-queue-group'
  );

  subscribtion.on('message', (msg: Message) => {
    let data = msg.getData();

    if (typeof data === 'string') {
      console.log(
        `Recieved event #${msg.getSequence()}, with data: `,
        JSON.parse(data)
      );
    }
  });
});
