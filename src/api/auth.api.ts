import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './base.axios'
import { privateApiClient } from '@/api/private.axios'

export enum Role {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  READONLY = 'readonly',
}

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

export interface Account {
  username: string;
  role?: Role;
}

export interface CreateAccountRequest {
  username: string;
  role?: Role;
}

export interface CreateAccountResponse {
  username: string;
  password: string;
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

export const getAllAccounts = async (): Promise<Account[]> => {
  const response = await privateApiClient.get<Account[]>(API_ENDPOINTS.AUTH.GET_ALL_ACCOUNTS)
  return response.data
}

export const createAccount = async (request: CreateAccountRequest): Promise<CreateAccountResponse> => {
  const response = await privateApiClient.post<CreateAccountResponse>(API_ENDPOINTS.AUTH.CREATE_ACCOUNT, request)
  return response.data
}