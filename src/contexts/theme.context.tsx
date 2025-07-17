import React, { createContext } from 'react'
import { useTheme } from '@/hooks/useTheme'

type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const defaultThemeContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeHook = useTheme()

  return <ThemeContext.Provider value={themeHook}>{children}</ThemeContext.Provider>
}

export { ThemeContext }
