import { render, screen } from '@testing-library/react'

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

import Page from '../home.page'

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the home page with AdminLayout', () => {
    // Arrange & Act
    render(<Page />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should display the navigation instruction message', () => {
    // Arrange & Act
    render(<Page />)

    // Assert
    expect(screen.getByText('Use the sidebar to navigate to start')).toBeInTheDocument()
  })

  it('should render the message as an h4 heading', () => {
    // Arrange & Act
    render(<Page />)

    // Assert
    const heading = screen.getByRole('heading', { level: 4 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Use the sidebar to navigate to start')
  })

  it('should apply correct styling classes to the container', () => {
    // Arrange & Act
    render(<Page />)

    // Assert
    const container = screen.getByText('Use the sidebar to navigate to start').parentElement
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-full')
  })

  it('should apply correct styling classes to the heading', () => {
    // Arrange & Act
    render(<Page />)

    // Assert
    const heading = screen.getByRole('heading', { level: 4 })
    expect(heading).toHaveClass('scroll-m-20', 'text-xl', 'font-semibold', 'tracking-tight', 'text-center')
  })
})
