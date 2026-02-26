import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://coreweb-dev-api.optum.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosClient;
