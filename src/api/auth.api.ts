import axios from 'axios';
import { apiClient } from './base.axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error message: ${error.response?.data?.message ?? 'Unknown error'}`);
    }
    throw new Error('An unexpected error occurred');
  }
};
