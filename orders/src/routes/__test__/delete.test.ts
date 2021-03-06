import { OrderStatus } from '@jmtickt/common';
import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import Ticket from '../../models/Ticket';
import { natsWrapper } from '../../natsWrapper';

it('marks an order as cancelled', async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const reponse = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(reponse.body.status).toEqual(OrderStatus.Canelled);
});

it('emits order:cancelled event', async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
