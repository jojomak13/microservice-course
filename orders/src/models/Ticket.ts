import mongoose, { Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import Order, { OrderStatus } from './Order';

interface ITicket {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: ITicket): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (data: { id: string; version: number }) => {
  return Ticket.findOne({ _id: data.id, version: data.version - 1 });
};

/**
 *  make sure that there is no order with this ticket and not *cancelled*
 * @param none
 * @returns Promise<boolean>
 */
ticketSchema.methods.isReserved = async function () {
  const orderExist = await Order.findOne({
    //@ts-ignore
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
      ],
    },
  });

  return !!orderExist;
};

const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export default Ticket;
