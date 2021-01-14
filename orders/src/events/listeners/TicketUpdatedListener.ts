import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@jmtickt/common';
import Ticket from '../../models/Ticket';
import { queueGroupName } from '../queueGroupName';

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

export { TicketUpdatedListener };
