import axios from 'axios'
import { getApiUrl } from '../lib/url'

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})
