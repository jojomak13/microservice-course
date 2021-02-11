const OrderIndex = ({ orders }) => {
  const statusColors = {
    cancelled: 'danger',
    created: 'warning',
    complete: 'success',
  };

  const mapOrders = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.ticket.title}</td>
        <td>{order.ticket.price}</td>
        <td>
          <span className={`badge badge-${statusColors[order.status]} p-1`}>
            {order.status}
          </span>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <div className="text-center p-5">
        <h1>My Orders</h1>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Ticket</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{mapOrders}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (_ctx, client) => {
  const { data } = await client.get('/orders');

  return { orders: data };
};

export default OrderIndex;
