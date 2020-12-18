import buildClient from '../api/buildClient';

const index = ({ user }) => {
  return (
    <div>
      <h1>Home Page</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>You are not logedin</p>}
    </div>
  );
};

index.getInitialProps = async (context) => {
  try {
    let { data } = await buildClient(context).get('/api/users/currentuser');
    return data;
  } catch (err) {
    return { user: null };
  }
};

export default index;
