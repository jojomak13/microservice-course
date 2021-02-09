import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import Order from '../../models/Order';
import { OrderStatus } from '@jmtickt/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when order not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '465465465',
      orderId: Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when pay order not belongs to the same user', async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    version: 0,
    price: 44,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '465465465',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when pay for cancelled order', async () => {
  const userId = Types.ObjectId().toHexString();

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 44,
    status: OrderStatus.Canelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: '465465465',
      orderId: order.id,
    })
    .expect(400);
});

it('retruns a 201 with valid inputs', async () => {
  const userId = Types.ObjectId().toHexString();

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 44,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.currency).toEqual('usd');
  expect(chargeOptions.amount).toEqual(order.price * 100);
});
