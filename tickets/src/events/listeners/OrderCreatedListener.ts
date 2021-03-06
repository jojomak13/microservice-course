import { Listener, OrderCreatedEvent, Subjects } from '@jmtickt/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher';
import { queueGroupName } from '../queueGroupName';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark the ticket as reserved
    ticket.set({ orderId: data.id });
    await ticket.save();

    // publish new event with [ticketUpdatedPublisher]
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}

export { OrderCreatedListener };
