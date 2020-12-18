import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/login',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const login = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="row justify-content-center mt-3">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Login Page</div>
          <div className="card-body">
            {errors}
            <form onSubmit={login}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="password"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
