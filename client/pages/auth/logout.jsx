import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const logout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/logout',
    method: 'post',
    body: {},
    onSuccess: (res) => Router.push('/'),
  });

  useEffect(() => doRequest(), []);

  return <div>Signing you out...</div>;
};

export default logout;
