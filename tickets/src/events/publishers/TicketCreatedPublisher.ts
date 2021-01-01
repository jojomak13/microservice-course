import { Publisher, Subjects, TicketCreatedEvent } from '@jmtickt/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
