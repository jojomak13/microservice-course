import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Ticket from '../../models/Ticket';
import Order, { OrderStatus } from '../../models/Order';
import { natsWrapper } from '../../natsWrapper';

it('returns 404 if the ticket does not exists', async () => {
  const ticketId = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the tickt reserved before', async () => {
  const ticket = Ticket.build({
    title: 'ticket title',
    price: 452,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: '465465',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserve a ticket', async () => {
  const ticket = Ticket.build({
    title: 'ticket title',
    price: 452,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order:created event', async () => {
  const ticket = Ticket.build({
    title: 'ticket title',
    price: 452,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
