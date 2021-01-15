import { OrderCreatedEvent, OrderStatus } from '@jmtickt/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/Ticket';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../OrderCreatedListener';

const setup = async () => {
  // create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'ticket title',
    price: 45,
    userId: 'e234',
  });

  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: Types.ObjectId().toHexString(),
    expiresAt: '465465656456465',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // console.log(ticket);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('calls acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
