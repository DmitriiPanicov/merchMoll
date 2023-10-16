import axios from 'axios';

export const actionGetToken =
  () =>  {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
  }

export default axios;
