import { useState } from 'react';
import axios from 'axios';

export default () => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  const signup = async (e) => {
    e.preventDefault();

    let res = await axios.post('http://tickets.test/api/user/signup', {
      email,
      password,
    });

    console.log(res.body);
  };

  return (
    <div className="row justify-content-center mt-3">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Signup Page</div>
          <div className="card-body">
            <form onSubmit={signup}>
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
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
