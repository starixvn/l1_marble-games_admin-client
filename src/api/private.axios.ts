import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../lib/url';

export const AUTH_TOKEN_KEY = 'auth_token';

export const globalAuthEventEmitter = new EventTarget();

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

const onResponseError = async (error: AxiosError) => {
  if (error.response?.status === 401) {
    globalAuthEventEmitter.dispatchEvent(new Event('logout'));
  }
  return Promise.reject(error);
};

privateApiClient.interceptors.response.use(
  (response) => response,
  onResponseError
);
