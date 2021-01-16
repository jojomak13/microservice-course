import request from 'supertest';
import app from '../../app';
import { Types } from 'mongoose';
import { natsWrapper } from '../../natsWrapper';
import Ticket from '../../models/Ticket';

it('returns 404 if the ticket not found', async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 456 })
    .expect(404);
});

it('returns 401 if the user not authenticated', async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'title', price: 456 })
    .expect(401);
});

it("returns 401 if the user dosen't own that ticket", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'tile', price: 123 })
    .expect(401);
});

it('returns 400 if the user provide invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 45 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: -45 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title' })
    .expect(400);
});

it('update the ticket if provide valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updated', price: 125 })
    .expect(200);

  const ticketReponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketReponse.body.title).toEqual('updated');
  expect(ticketReponse.body.price).toEqual(125);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updated', price: 125 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 45 });

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updated', price: 125 })
    .expect(400);
});
