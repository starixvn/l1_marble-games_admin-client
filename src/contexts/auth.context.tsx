import React, { createContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth as useAuthHook, type UseAuthReturn } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

// Create a default context value with no-op functions to prevent errors
const defaultAuthContext: UseAuthReturn = {
  token: null,
  isAuthenticated: false,
  isLoading: true,
  handleLogout: () => {},
  updateAuthToken: () => {},
  handleLogin: async () => {},
}

const AuthContext = createContext<UseAuthReturn>(defaultAuthContext)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthHook()

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export { AuthContext }
