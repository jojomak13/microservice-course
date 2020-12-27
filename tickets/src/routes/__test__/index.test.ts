import request from 'supertest';
import app from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });
};

it('fetch a list of tickets', async () => {
  await createTicket('ticket 1', 20);
  await createTicket('ticket 2', 402);
  await createTicket('ticket 3', 305);

  const response = await request(app).get('/api/tickets').expect(200);

  expect(response.body.length).toEqual(3);
});
