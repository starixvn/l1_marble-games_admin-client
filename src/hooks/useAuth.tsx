import { useState, useEffect, useCallback } from 'react'
import { login } from '@/api/auth.api'
import { AUTH_TOKEN_KEY, globalAuthEventEmitter } from '@/api/private.axios'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface UseAuthReturn extends AuthState {
  handleLogout: () => void
  updateAuthToken: (token: string) => void
  handleLogin: (credential: UserCredential) => Promise<void>
}

export interface UserCredential {
  username: string
  password: string
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const setAuthToken = useCallback((newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken)
    setAuthState({
      token: newToken,
      isAuthenticated: true,
      isLoading: false,
    })
  }, [])

  const handleLogout = useCallback(() => {
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [setAuthState])

  const updateAuthToken = useCallback(
    (newToken: string) => {
      setAuthToken(newToken)
    },
    [setAuthToken],
  )

  const handleLogin = useCallback(
    async (credential: UserCredential) => {
      const response = await login(credential)
      setAuthToken(response.access_token)
    },
    [setAuthToken],
  )

  useEffect(() => {
    globalAuthEventEmitter.addEventListener('logout', handleLogout)

    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      if (storedToken) {
        setAuthState({
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch {
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }

    return () => {
      globalAuthEventEmitter.removeEventListener('logout', handleLogout)
    }
  }, [handleLogout])

  return {
    ...authState,
    handleLogout,
    updateAuthToken,
    handleLogin,
  }
}
