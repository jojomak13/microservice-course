import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, user }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      let msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            #{order.id} -{' '}
            <span className="badge badge-primary p-1">{order.status}</span>
          </div>
          <div className="card-body">
            {errors}
            {timeLeft < 0 ? (
              <p>Order Expired</p>
            ) : (
              <p>
                Time left to pay: <strong>{timeLeft}</strong> seconds
              </p>
            )}
          </div>
          <div className="card-footer text-center">
            {timeLeft < 0 ? (
              <button disabled className="btn btn-success">
                Pay Now
              </button>
            ) : (
              <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_vs2mJM5i18UsWUw58nkhYNK6004VW6Y7YE"
                amount={order.ticket.price * 100}
                email={user.email}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
