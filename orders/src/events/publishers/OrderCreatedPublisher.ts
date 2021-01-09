import { OrderCreatedEvent, Publisher, Subjects } from '@jmtickt/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
