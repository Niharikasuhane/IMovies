import axios from 'axios';

const origin = import.meta.env.VITE_API_ORIGIN || '';
export const API_ORIGIN = origin;

const api = axios.create({ baseURL: `${origin}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) =>
  e.response?.data?.errors?.map((x) => x.message).join(', ') || e.response?.data?.message || e.message || 'Something went wrong';

export const imgUrl = (p) => (!p ? 'https://placehold.co/300x450?text=No+Poster' : p.startsWith('http') ? p : `${origin}${p}`);

export default api;
