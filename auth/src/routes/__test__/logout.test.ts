import request from 'supertest';
import app from '../../app';

it('clears the cookies after logout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jojo@test.com', password: '123456' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/logout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toEqual([
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  ]);
});
