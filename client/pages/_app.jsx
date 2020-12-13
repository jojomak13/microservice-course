import 'bootstrap/dist/css/bootstrap.css';

export default ({ Component, pageProps }) => {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
};
