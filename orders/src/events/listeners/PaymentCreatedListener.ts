import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@jmtickt/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/Order';
import { queueGroupName } from '../queueGroupName';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentsCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('order not found');
    }

    order.set({ status: OrderStatus.Complete });

    msg.ack();
  }
}

export { PaymentCreatedListener };
