import mongoose, { Schema, model } from 'mongoose';
import { addSyntheticTrailingComment } from 'typescript';
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
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: ITicket): TicketDocument;
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

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

/**
 *  make sure that there is no order with this ticket and not *cancelled*
 * @param none
 * @returns Promise<boolean>
 */
ticketSchema.methods.isReserved = async function () {
  const orderExist = await Order.findOne({
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
