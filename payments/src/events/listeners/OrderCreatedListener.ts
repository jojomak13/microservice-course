import { Listener, OrderCreatedEvent, Subjects } from '@jmtickt/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/Order';
import { queueGroupName } from '../queueGroupName';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}

export { OrderCreatedListener };
