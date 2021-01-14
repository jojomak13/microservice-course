import Ticket from '../../../models/Ticket';
import { natsWrapper } from '../../../natsWrapper';
import { TicketUpdatedListener } from '../TicketUpdatedListener';
import { Types } from 'mongoose';
import { TicketUpdatedEvent } from '@jmtickt/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'title',
    price: 45,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'ticket',
    price: 15,
    userId: '455',
    version: ticket.version + 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('finds, update and save a ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updateTicket = await Ticket.findById(ticket.id);
  expect(updateTicket).toBeDefined();
  expect(updateTicket!.price).toEqual(15);
  expect(updateTicket!.version).toEqual(ticket.version + 1);
});

it('acks the message', async () => {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("doesn't call ack if the event version is higher", async () => {
  const { msg, data, listener } = await setup();

  data.version = 45;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
