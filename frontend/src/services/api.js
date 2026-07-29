import axios from 'axios';

const api = axios.create({
  baseURL: "https://staymate-1-xg47.onrender.com/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staymate_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
console.log("API BASE URL =", "https://staymate-1-xg47.onrender.com/api");
export default api;