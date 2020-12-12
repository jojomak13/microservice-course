import request from 'supertest';
import app from '../../app';

it('returns with 201 on successfull signup', () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);
});

it('returns with 400 with an invalid email', () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'jojocom', password: '123456' })
    .expect(400);
});

it('returns with 400 with an invalid password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '12' })
    .expect(400);
});

it('returns with 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com' })
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({ password: '123456' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(400);
});

it('sets a cookie after signup successfully', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
