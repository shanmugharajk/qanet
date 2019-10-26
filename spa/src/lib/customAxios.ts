import axios from 'axios';

axios.defaults.withCredentials = true;

const customAxios = axios;

export default customAxios;
