import { OrderCreatedEvent, OrderStatus } from '@jmtickt/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import Order from '../../../models/Order';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../OrderCreatedListener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    userId: '464656',
    status: OrderStatus.Created,
    expiresAt: '4564665',
    version: 0,
    ticket: {
      id: '465465',
      price: 455,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('duplicate the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toBe(data.ticket.price);
});

it('ack the message event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
