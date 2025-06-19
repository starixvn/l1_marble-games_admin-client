import { useState, useEffect, useCallback } from 'react';
import { login } from '@/api/auth.api';
import { AUTH_TOKEN_KEY } from '@/api/private.axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UseAuthReturn extends AuthState {
  handleLogout: () => void;
  updateAuthToken: (token: string) => void;
  handleLogin: (credential: UserCredential) => Promise<void>;
}

export interface UserCredential {
  username: string;
  password: string;
}


export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        setAuthState({
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

    } catch (error) {
      console.error('Error loading auth token from localStorage:', error);
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const setAuthToken = useCallback((newToken: string) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      setAuthState({
        token: newToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error saving auth token to localStorage:', error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

    } catch (error) {
      console.error('Error removing auth token from localStorage:', error);
    }
  }, []);

  const updateAuthToken = useCallback((newToken: string) => {
    setAuthToken(newToken);
  }, []);

  const handleLogin = useCallback(async (credential: UserCredential) => {
    const response = await login(credential);
    setAuthToken(response.access_token);
  }, []);

  return {
    ...authState,
    handleLogout,
    updateAuthToken,
    handleLogin,
  };
};
