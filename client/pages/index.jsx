const index = ({ user }) => {
  return (
    <div>
      <h1>Home Page</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>You are not logedin</p>}
    </div>
  );
};

index.getInitialProps = async (context, client, user) => {
  return {};
};

export default index;
