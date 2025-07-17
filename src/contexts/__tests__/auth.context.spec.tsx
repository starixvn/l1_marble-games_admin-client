import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from '../auth.context'
import type { UseAuthReturn } from '@/hooks/useAuth'
import * as useAuthModule from '@/hooks/useAuth'

const TestConsumer: React.FC = () => {
  const authContext = useContext(AuthContext)
  return (
    <div>
      <div data-testid="token">{authContext.token ?? 'null'}</div>
      <div data-testid="is-authenticated">{authContext.isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{authContext.isLoading.toString()}</div>
      <button data-testid="logout-btn" onClick={authContext.handleLogout}>
        Logout
      </button>
      <button data-testid="update-token-btn" onClick={() => authContext.updateAuthToken('new-token')}>
        Update Token
      </button>
      <button data-testid="login-btn" onClick={() => authContext.handleLogin({ username: 'test', password: 'test' })}>
        Login
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  const mockAuthState: UseAuthReturn = {
    token: 'test-token',
    isAuthenticated: true,
    isLoading: false,
    handleLogout: vi.fn(),
    updateAuthToken: vi.fn(),
    handleLogin: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(mockAuthState)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when provided', () => {
    // Arrange
    const testMessage = 'Test child component'
    
    // Act
    render(
      <AuthProvider>
        <div data-testid="test-child">{testMessage}</div>
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('should call useAuth hook when provider is rendered', () => {
    // Arrange & Act
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    )

    // Assert
    expect(useAuthModule.useAuth).toHaveBeenCalledTimes(1)
  })

  it('should provide auth context with values from useAuth hook', () => {
    // Arrange
    const customAuthState: UseAuthReturn = {
      token: 'custom-token',
      isAuthenticated: false,
      isLoading: true,
      handleLogout: vi.fn(),
      updateAuthToken: vi.fn(),
      handleLogin: vi.fn(),
    }
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(customAuthState)

    // Act
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('token')).toHaveTextContent('custom-token')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
  })

  it('should provide auth context with default values when useAuth returns default state', () => {
    // Arrange
    const defaultAuthState: UseAuthReturn = {
      token: null,
      isAuthenticated: false,
      isLoading: true,
      handleLogout: vi.fn(),
      updateAuthToken: vi.fn(),
      handleLogin: vi.fn(),
    }
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(defaultAuthState)

    // Act
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Assert
    expect(screen.getByTestId('token')).toHaveTextContent('null')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
  })

  it('should provide working auth functions from useAuth hook', () => {
    // Arrange
    const mockHandleLogout = vi.fn()
    const mockUpdateAuthToken = vi.fn()
    const mockHandleLogin = vi.fn()

    const authStateWithFunctions: UseAuthReturn = {
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      handleLogout: mockHandleLogout,
      updateAuthToken: mockUpdateAuthToken,
      handleLogin: mockHandleLogin,
    }
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(authStateWithFunctions)

    // Act
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Assert
    const logoutBtn = screen.getByTestId('logout-btn')
    const updateTokenBtn = screen.getByTestId('update-token-btn')
    const loginBtn = screen.getByTestId('login-btn')

    expect(logoutBtn).toBeInTheDocument()
    expect(updateTokenBtn).toBeInTheDocument()
    expect(loginBtn).toBeInTheDocument()

    // Test that functions are callable
    logoutBtn.click()
    expect(mockHandleLogout).toHaveBeenCalledTimes(1)

    updateTokenBtn.click()
    expect(mockUpdateAuthToken).toHaveBeenCalledWith('new-token')

    loginBtn.click()
    expect(mockHandleLogin).toHaveBeenCalledWith({ username: 'test', password: 'test' })
  })

  it('should handle multiple children correctly', () => {
    // Arrange
    const children = [
      <div key="1" data-testid="child-1">Child 1</div>,
      <div key="2" data-testid="child-2">Child 2</div>,
      <TestConsumer key="3" />,
    ]

    // Act
    render(<AuthProvider>{children}</AuthProvider>)

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('token')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('should handle empty children gracefully', () => {
    // Arrange & Act
    const { container } = render(<AuthProvider>{null}</AuthProvider>)

    // Assert
    expect(container.firstChild).toBeNull()
    expect(useAuthModule.useAuth).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined children gracefully', () => {
    // Arrange & Act
    const { container } = render(<AuthProvider>{undefined}</AuthProvider>)

    // Assert
    expect(container.firstChild).toBeNull()
    expect(useAuthModule.useAuth).toHaveBeenCalledTimes(1)
  })

  it('should maintain context value reference when useAuth returns same object', () => {
    // Arrange
    const authState = { ...mockAuthState }
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(authState)

    // Act
    const { rerender } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Assert
    expect(useAuthModule.useAuth).toHaveBeenCalledTimes(1)

    // Re-render and verify hook is called again
    rerender(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(useAuthModule.useAuth).toHaveBeenCalledTimes(2)
  })

  it('should handle async auth functions correctly', async () => {
    // Arrange
    const mockAsyncHandleLogin = vi.fn().mockResolvedValue(undefined)
    const authStateWithAsync: UseAuthReturn = {
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      handleLogout: vi.fn(),
      updateAuthToken: vi.fn(),
      handleLogin: mockAsyncHandleLogin,
    }
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(authStateWithAsync)

    // Act
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    // Assert
    expect(mockAsyncHandleLogin).toHaveBeenCalledWith({ username: 'test', password: 'test' })
  })
})
