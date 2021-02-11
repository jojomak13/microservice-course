import Link from 'next/link';

const index = ({ user, tickets }) => {
  const mapTickets = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
            <a className="btn btn-primary">View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <div className="text-center p-5">
        <h1>Tickets</h1>
      </div>
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{mapTickets}</tbody>
      </table>
    </div>
  );
};

index.getInitialProps = async (_context, client, _user) => {
  const { data } = await client.get('/tickets');

  return { tickets: data };
};

export default index;
