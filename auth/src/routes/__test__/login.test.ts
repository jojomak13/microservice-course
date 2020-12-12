import request from 'supertest';
import app from '../../app';

it('fails with 400 when email not exists', () => {
  return request(app)
    .post('/api/users/login')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(400);
});

it('fails with 400 when provide invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);

  return request(app)
    .post('/api/users/login')
    .send({ email: 'jojo@test.com', password: '4654656' })
    .expect(400);
});

it('sets a cookie after login successfully', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/login')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
