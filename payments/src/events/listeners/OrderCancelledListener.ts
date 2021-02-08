import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@jmtickt/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/Order';
import { queueGroupName } from '../queueGroupName';

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('order not found');
    }

    order.set({ status: OrderStatus.Canelled });
    await order.save();

    msg.ack();
  }
}

export { OrderCancelledListener };
