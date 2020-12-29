import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  let data = JSON.stringify({
    id: 456,
    title: 'ticket title',
    price: 465,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event Published');
  });
});
