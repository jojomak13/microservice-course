import { Publisher, Subjects, TicketUpdatedEvent } from '@jmtickt/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
