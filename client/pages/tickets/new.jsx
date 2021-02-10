import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const newTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: (ticket) => Router.push('/'),
  });

  const onBlur = () => {
    let value = parseFloat(price);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="row justify-content-center mt-3">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Create New Ticket</div>
          <div className="card-body">
            {errors}
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  value={price}
                  onBlur={onBlur}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default newTicket;
