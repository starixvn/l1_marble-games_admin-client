import axios from 'axios';
import { getApiUrl } from '../lib/url';

export const AUTH_TOKEN_KEY = 'auth_token';

export const privateApiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

privateApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
