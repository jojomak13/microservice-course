import axios from 'axios';
import { useState } from 'react';
import Error from '../components/Error';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err) {
      console.log('Error', err);
      setErrors(<Error errors={err.response.data.errors} />);
    }
  };

  return { errors, doRequest };
};

export default useRequest;
