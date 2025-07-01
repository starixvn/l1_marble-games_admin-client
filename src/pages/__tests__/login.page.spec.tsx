import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/login-form', () => ({
  LoginForm: vi.fn(({ handleLogin }) => (
    <div data-testid="login-form">
      <button data-testid="login-btn" onClick={() => handleLogin({ username: 'test', password: 'test' })}>
        Login
      </button>
    </div>
  )),
}))

vi.mock('@/components/layouts/minimal.layout', () => ({
  MinimalLayout: vi.fn(({ children }) => <div data-testid="minimal-layout">{children}</div>),
}))

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

// Mock the AuthContext
vi.mock('@/contexts/auth.context', () => ({
  AuthContext: 'mock-auth-context',
}))

// Mock React's useContext
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  const mockUseContext = vi.fn()
  return {
    ...actual,
    useContext: mockUseContext,
    _mockUseContext: mockUseContext,
  }
})

import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import LoginPage from '../login.page'
import * as ReactModuleImport from 'react'

type ReactWithMock = typeof import('react') & { _mockUseContext: ReturnType<typeof vi.fn> }
const ReactModule = ReactModuleImport as ReactWithMock

// Mock React hooks
const mockUseNavigate = useNavigate as ReturnType<typeof vi.fn>
const mockUseSearchParams = useSearchParams as ReturnType<typeof vi.fn>
const mockToastError = toast.error as ReturnType<typeof vi.fn>

describe('Login Page', () => {
  const mockNavigate = vi.fn()
  const mockHandleLoginAuth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseNavigate.mockReturnValue(mockNavigate)
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?redirect=/dashboard'),
      vi.fn(),
    ])
    
    // Default auth context mock
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: false,
    })
  })

  it('should render the login page with MinimalLayout', () => {
    // Arrange & Act
    render(<LoginPage />)

    // Assert
    expect(screen.getByTestId('minimal-layout')).toBeInTheDocument()
  })

  it('should render the LoginForm component', () => {
    // Arrange & Act
    render(<LoginPage />)

    // Assert
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('should navigate to redirect path when user is authenticated', async () => {
    // Arrange
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: true,
    })

    // Act
    render(<LoginPage />)

    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
        state: { from: '/dashboard' },
      })
    })
  })

  it('should navigate to default path when no redirect parameter is provided', async () => {
    // Arrange
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()])
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: true,
    })

    // Act
    render(<LoginPage />)

    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', {
        replace: true,
        state: { from: '/' },
      })
    })
  })

  it('should not navigate when user is not authenticated', () => {
    // Arrange
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: false,
    })

    // Act
    render(<LoginPage />)

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle successful login without error', async () => {
    // Arrange
    mockHandleLoginAuth.mockResolvedValue(undefined)
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: false,
    })

    // Act
    render(<LoginPage />)

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    // Assert
    await waitFor(() => {
      expect(mockHandleLoginAuth).toHaveBeenCalledWith({
        username: 'test',
        password: 'test',
      })
    })
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it('should handle login error and show toast', async () => {
    // Arrange
    const mockError = new Error('Login failed')
    mockHandleLoginAuth.mockRejectedValue(mockError)
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: false,
    })

    // Act
    render(<LoginPage />)

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    // Assert
    await waitFor(() => {
      expect(mockHandleLoginAuth).toHaveBeenCalledWith({
        username: 'test',
        password: 'test',
      })
    })
    expect(mockToastError).toHaveBeenCalledWith('Login failed')
  })

  it('should handle login error with non-Error object', async () => {
    // Arrange
    const mockError = { message: 'Custom error' }
    mockHandleLoginAuth.mockRejectedValue(mockError)
    ReactModule._mockUseContext.mockReturnValue({
      handleLogin: mockHandleLoginAuth,
      isAuthenticated: false,
    })

    // Act
    render(<LoginPage />)

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    // Assert
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Custom error')
    })
  })
})
