import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth as useAuthHook, type UseAuthReturn } from '@/hooks/useAuth';


interface AuthProviderProps {
  children: ReactNode;
}


const AuthContext = createContext<UseAuthReturn | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthHook();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
