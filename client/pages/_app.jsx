import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <div>
      <Header user={user}></Header>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  try {
    let { data } = await buildClient(ctx).get('/api/users/currentuser');

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { ...data, pageProps };
  } catch (err) {
    return { user: null };
  }
};

export default AppComponent;
