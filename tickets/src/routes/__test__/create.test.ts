import request from 'supertest';
import app from '../../app';

it('Has a route handler listening to /api/tickets/ for post request', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('Can be only accessed by signed in user', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('Returns a status other than 401 if user signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('Returns an error if an invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 465,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 465,
    })
    .expect(400);
});

it('Returns an error if an invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket title',
      price: -465,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket title',
    })
    .expect(400);
});

it('Creates a ticket with a valid inputs with response 201', async () => {
  await request(app)
    .post('/api/tickets')
    .send({
      title: 'This is ticket title',
      price: 45,
    })
    .expect(201);
});
