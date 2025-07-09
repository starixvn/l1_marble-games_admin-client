import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './base.axios'
import { privateApiClient } from '@/api/private.axios'

interface LoginRequest {
  username: string
  password: string
}

interface UserCred {
  username: string
  password: string
}

interface LoginResponse {
  access_token: string
}

export interface Profile {
  username: string;
  role?: string;
  allowedEndpoints: string[];
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
  return response.data
}

export const getProfile = async (): Promise<Profile> => {
  const response = await privateApiClient.get<Profile>(API_ENDPOINTS.AUTH.PROFILE)
  return response.data
}

export const changePassword = async (): Promise<UserCred> => {
  const response = await privateApiClient.post<UserCred>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD)
  return response.data
}