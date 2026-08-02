import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api';

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staymate_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

console.log('API BASE URL =', apiBaseUrl);
export default api;