import { render, screen } from '@testing-library/react'

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

vi.mock('@/components/404', () => ({
  default: vi.fn(() => <div data-testid="not-found-component">404 Not Found</div>),
}))

import NotFoundPage from '../notfound.page'

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the notfound page with AdminLayout', () => {
    // Arrange & Act
    render(<NotFoundPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render the NotFound component', () => {
    // Arrange & Act
    render(<NotFoundPage />)

    // Assert
    expect(screen.getByTestId('not-found-component')).toBeInTheDocument()
  })

  it('should display the 404 content', () => {
    // Arrange & Act
    render(<NotFoundPage />)

    // Assert
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })

  it('should have the NotFound component as a child of AdminLayout', () => {
    // Arrange & Act
    render(<NotFoundPage />)

    // Assert
    const adminLayout = screen.getByTestId('admin-layout')
    const notFoundComponent = screen.getByTestId('not-found-component')
    expect(adminLayout).toContainElement(notFoundComponent)
  })
})
