import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach a fresh Firebase Auth ID token on every request.
// Firebase automatically refreshes the token when it is within 5 minutes of
// expiry, so passing false here is sufficient for the vast majority of requests.
// The backend always receives a valid Firebase JWT.
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(/* forceRefresh */ false);
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // If token retrieval fails, proceed without the header; the backend
        // will respond with 401 and the response interceptor will redirect.
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle auth errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
