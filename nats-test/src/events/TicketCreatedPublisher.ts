import { Publisher } from './Publisher';
import { Subjects } from './Subjects';
import { TicketCreatedEvent } from './TicketCreatedEvent';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
