import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';

it('returns a 404 if ticket not found', async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('returns a ticket if ticket is found', async () => {
  let data = { title: 'title', price: 465 };

  let response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(data)
    .expect(201);

  let ticketReponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(ticketReponse.body.title).toEqual(data.title);
  expect(ticketReponse.body.price).toEqual(data.price);
});
