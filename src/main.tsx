import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/contexts/theme.context.tsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/contexts/auth.context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </AuthProvider>

    </ThemeProvider>
  </StrictMode>,
)
