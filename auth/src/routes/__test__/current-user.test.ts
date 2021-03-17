import request from 'supertest';
import app from '../../app';

it('reponds with user details', async () => {
  const cookie = await global.signin();
  const reponse = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(reponse.body.user.email).toEqual('jojo@test.com');
});

it('responds with null incase of not logged in', async () => {
  const response = await request(app).get('/api/users/currentuser').send();

  expect(response.body.user).toEqual(null);
});
