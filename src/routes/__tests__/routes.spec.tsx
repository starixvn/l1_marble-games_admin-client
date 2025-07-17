import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { RouteHandler } from '../routes'

// Mock all page components
vi.mock('@/pages/home.page', () => ({
  default: vi.fn(() => <div data-testid="home-page">Home Page</div>),
}))

vi.mock('@/pages/login.page', () => ({
  default: vi.fn(() => <div data-testid="login-page">Login Page</div>),
}))

vi.mock('@/pages/operators.page', () => ({
  default: vi.fn(() => <div data-testid="operators-page">Operators Page</div>),
}))

vi.mock('@/pages/notfound.page', () => ({
  default: vi.fn(() => <div data-testid="notfound-page">Not Found Page</div>),
}))

vi.mock('@/pages/game-configs.page', () => ({
  default: vi.fn(() => <div data-testid="game-configs-page">Game Configs Page</div>),
}))

vi.mock('@/pages/game-integrations.page', () => ({
  GameIntegrationsPage: vi.fn(() => <div data-testid="game-integrations-page">Game Integrations Page</div>),
}))

vi.mock('@/pages/game-config-schema.page', () => ({
  default: vi.fn(() => <div data-testid="game-config-schema-page">Game Config Schema Page</div>),
}))

vi.mock('@/pages/api-log.page', () => ({
  ApiLogsPage: vi.fn(() => <div data-testid="api-logs-page">API Logs Page</div>),
}))

vi.mock('@/pages/admin-log.page', () => ({
  AdminLogPage: vi.fn(() => <div data-testid="admin-log-page">Admin Log Page</div>),
}))

vi.mock('@/pages/account.page', () => ({
  AccountPage: vi.fn(() => <div data-testid="account-page">Account Page</div>),
}))

// Mock PrivateRoute
vi.mock('@/routes/private-route', () => ({
  PrivateRoute: vi.fn(({ children }) => <div data-testid="private-route">{children}</div>),
}))

describe('RouteHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render home page for root path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('should render operators page for /operators path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/operators']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('operators-page')).toBeInTheDocument()
    expect(screen.getByText('Operators Page')).toBeInTheDocument()
  })

  it('should render login page for /login path without PrivateRoute wrapper', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/login']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.queryByTestId('private-route')).not.toBeInTheDocument()
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('should render game configs page for /game-configs path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-configs']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-configs-page')).toBeInTheDocument()
    expect(screen.getByText('Game Configs Page')).toBeInTheDocument()
  })

  it('should render game configs page for /game-configs/:gameId path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-configs/123']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-configs-page')).toBeInTheDocument()
    expect(screen.getByText('Game Configs Page')).toBeInTheDocument()
  })

  it('should render game config schema page for /game-config-schemas path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-config-schemas']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-config-schema-page')).toBeInTheDocument()
    expect(screen.getByText('Game Config Schema Page')).toBeInTheDocument()
  })

  it('should render game integrations page for /game-integrations path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-integrations']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-integrations-page')).toBeInTheDocument()
    expect(screen.getByText('Game Integrations Page')).toBeInTheDocument()
  })

  it('should render API logs page for /logs-api path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/logs-api']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('api-logs-page')).toBeInTheDocument()
    expect(screen.getByText('API Logs Page')).toBeInTheDocument()
  })

  it('should render admin log page for /admin-log path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/admin-log']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('admin-log-page')).toBeInTheDocument()
    expect(screen.getByText('Admin Log Page')).toBeInTheDocument()
  })

  it('should render account page for /accounts path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/accounts']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('account-page')).toBeInTheDocument()
    expect(screen.getByText('Account Page')).toBeInTheDocument()
  })

  it('should render not found page for unknown paths', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument()
    expect(screen.getByText('Not Found Page')).toBeInTheDocument()
  })

  it('should render not found page for root wildcard path', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/some/random/path']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument()
    expect(screen.getByText('Not Found Page')).toBeInTheDocument()
  })

  it('should wrap private routes with PrivateRoute component', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/operators']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('operators-page')).toBeInTheDocument()
  })

  it('should not wrap public routes with PrivateRoute component', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/login']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.queryByTestId('private-route')).not.toBeInTheDocument()
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('should handle multiple route matches correctly', () => {
    // Test initial route
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert initial route
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
    unmount()

    // Test different route
    render(
      <MemoryRouter initialEntries={['/operators']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert new route
    expect(screen.getByTestId('operators-page')).toBeInTheDocument()
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument()
  })

  it('should handle route with query parameters', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-configs/123?param=value']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-configs-page')).toBeInTheDocument()
  })

  it('should handle route with hash', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/game-configs#section']}>
        <RouteHandler />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByTestId('private-route')).toBeInTheDocument()
    expect(screen.getByTestId('game-configs-page')).toBeInTheDocument()
  })

  it('should render all routes with correct structure', () => {
    // Test that all routes are properly configured
    const routes = [
      { path: '/', testId: 'home-page' },
      { path: '/operators', testId: 'operators-page' },
      { path: '/game-configs', testId: 'game-configs-page' },
      { path: '/game-config-schemas', testId: 'game-config-schema-page' },
      { path: '/game-integrations', testId: 'game-integrations-page' },
      { path: '/logs-api', testId: 'api-logs-page' },
      { path: '/admin-log', testId: 'admin-log-page' },
      { path: '/accounts', testId: 'account-page' },
    ]

    routes.forEach(({ path, testId }) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <RouteHandler />
        </MemoryRouter>
      )

      expect(screen.getByTestId('private-route')).toBeInTheDocument()
      expect(screen.getByTestId(testId)).toBeInTheDocument()

      unmount()
    })
  })

  it('should handle empty route array gracefully', () => {
    // This test ensures the component doesn't break if routes array is empty
    // The actual implementation always has routes, but this tests the mapping logic
    expect(() => {
      render(
        <MemoryRouter>
          <RouteHandler />
        </MemoryRouter>
      )
    }).not.toThrow()
  })
})
