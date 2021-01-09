import { OrderCancelledEvent, Publisher, Subjects } from '@jmtickt/common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
