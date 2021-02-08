import { Types } from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@jmtickt/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCancelledListener } from '../OrderCancelledListener';
import { Message } from 'node-nats-streaming';
import Order from '../../../models/Order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: '56465',
    version: 0,
    price: 455,
    status: OrderStatus.Created,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: '4566',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it('change status of order to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Canelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
