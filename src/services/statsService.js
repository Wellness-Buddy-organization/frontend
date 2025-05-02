import axios from 'axios';

export const fetchStats = async () => {
  const response = await axios.get(import.meta.env.VITE_API_URL + '/stats');
  return response.data;
};
