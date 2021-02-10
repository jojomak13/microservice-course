import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <div>
      <Header user={user}></Header>
      <div className="container">
        <Component user={user} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  let client = buildClient(ctx);
  let { data } = await client.get('/users/currentuser');

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.user);
  }

  return { ...data, pageProps };
};

export default AppComponent;
