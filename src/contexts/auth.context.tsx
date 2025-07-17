import React, { createContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth , type UseAuthReturn } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

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
  const authState = useAuth()

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export { AuthContext }
