import { TicketCreatedEvent } from '@jmtickt/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/Ticket';
import { natsWrapper } from '../../../natsWrapper';
import { TicketCreatedListener } from '../TicketCreatedListener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake event
  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    title: 'title',
    price: 45,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and save a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the [onMessage] function with data object + message object
  await listener.onMessage(data, msg);

  // write assert to make sure a ticket created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the [onMessage] function with data object + message object
  await listener.onMessage(data, msg);

  // make sure [ack] function is called
  expect(msg.ack).toHaveBeenCalled();
});
