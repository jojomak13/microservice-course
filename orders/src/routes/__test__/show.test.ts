import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import Ticket from '../../models/Ticket';

it('returns an error 401 if another user try to fetch another order', async () => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 45,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('returns an order', async () => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 45,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
});
