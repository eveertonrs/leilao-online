import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // O endereço da sua API backend
});

export default api;
