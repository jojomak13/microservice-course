import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Show Ticket</div>
          <div className="card-body">
            {errors}
            <h2>{ticket.title}</h2>
            <h4>
              Price: <span className="text-muted">${ticket.price}</span>
            </h4>
          </div>
          <div className="card-footer text-center">
            <button onClick={() => doRequest()} className="btn btn-success">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
