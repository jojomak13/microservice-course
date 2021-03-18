import axios from 'axios';

const _serverClient = (req) => {
  return axios.create({
    baseURL: 'http://www.ticketing.gq/api',
    headers: req.headers,
  });
};

const _browserCLient = () => {
  return axios.create({
    baseURL: '/api',
  });
};

const buildClient = ({ req }) => {
  // We are on server
  if (typeof window === 'undefined') return _serverClient(req);
  // We are on browser
  else return _browserCLient();
};

export default buildClient;
