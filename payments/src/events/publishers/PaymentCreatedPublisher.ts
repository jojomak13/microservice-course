import { PaymentCreatedEvent, Publisher, Subjects } from '@jmtickt/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentsCreated;
}

export { PaymentCreatedPublisher };
