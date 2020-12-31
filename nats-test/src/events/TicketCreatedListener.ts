import { Message } from 'node-nats-streaming';
import { Listener } from './Listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './TicketCreatedEvent';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data: ', data);
    msg.ack();
  }
}

export { TicketCreatedListener };
