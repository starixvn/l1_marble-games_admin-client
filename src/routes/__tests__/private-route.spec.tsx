import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'
import { PrivateRoute } from '../private-route'

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useLocation: vi.fn(),
    Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>),
  }
})

// Mock AuthContext
const mockAuthContext = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  handleLogout: vi.fn(),
  updateAuthToken: vi.fn(),
  handleLogin: vi.fn(),
}

vi.mock('@/contexts/auth.context', () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Consumer: ({ children }: { children: (value: typeof mockAuthContext) => React.ReactNode }) => children(mockAuthContext),
  },
}))

// Mock useContext to return our mock context
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(() => mockAuthContext),
  }
})

const TestComponent = () => <div data-testid="test-component">Test Content</div>

describe('PrivateRoute', () => {
  const mockUseLocation = useLocation as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({
      pathname: '/test-path',
      search: '?param=value',
      hash: '',
      state: null,
    })
  })

  it('should render children when user is authenticated', () => {
    // Arrange
    mockAuthContext.isAuthenticated = true
    mockAuthContext.isLoading = false

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should show loading state when authentication is loading', () => {
    // Arrange
    mockAuthContext.isAuthenticated = false
    mockAuthContext.isLoading = true

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument()
  })

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    mockAuthContext.isAuthenticated = false
    mockAuthContext.isLoading = false

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login?redirect=%2Ftest-path%3Fparam%3Dvalue')
    expect(screen.getByText('Navigate to /login?redirect=%2Ftest-path%3Fparam%3Dvalue')).toBeInTheDocument()
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument()
  })

  it('should redirect to login with encoded pathname and search params', () => {
    // Arrange
    mockAuthContext.isAuthenticated = false
    mockAuthContext.isLoading = false
    mockUseLocation.mockReturnValue({
      pathname: '/protected/route',
      search: '?id=123&type=admin',
      hash: '',
      state: null,
    })

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login?redirect=%2Fprotected%2Froute%3Fid%3D123%26type%3Dadmin')
  })

  it('should redirect to login with only pathname when no search params', () => {
    // Arrange
    mockAuthContext.isAuthenticated = false
    mockAuthContext.isLoading = false
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
    })

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login?redirect=%2Fdashboard')
  })

  it('should render children when loading is false and user is authenticated', () => {
    // Arrange
    mockAuthContext.isAuthenticated = true
    mockAuthContext.isLoading = false

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })

  it('should handle complex children components', () => {
    // Arrange
    mockAuthContext.isAuthenticated = true
    mockAuthContext.isLoading = false

    const ComplexComponent = () => (
      <div data-testid="complex-component">
        <h1>Complex Title</h1>
        <p>Complex content</p>
        <button>Click me</button>
      </div>
    )

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <ComplexComponent />
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('complex-component')).toBeInTheDocument()
    expect(screen.getByText('Complex Title')).toBeInTheDocument()
    expect(screen.getByText('Complex content')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle multiple children', () => {
    // Arrange
    mockAuthContext.isAuthenticated = true
    mockAuthContext.isLoading = false

    // Act
    render(
      <MemoryRouter>
        <PrivateRoute>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('should handle empty children gracefully', () => {
    // Arrange
    mockAuthContext.isAuthenticated = true
    mockAuthContext.isLoading = false

    // Act
    const { container } = render(
      <MemoryRouter>
        <PrivateRoute>
          {null}
        </PrivateRoute>
      </MemoryRouter>
    )

    // Assert
    expect(container.firstChild).toBeNull()
  })
})
