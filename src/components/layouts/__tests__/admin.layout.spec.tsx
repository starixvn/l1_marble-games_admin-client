import { render, screen } from '@testing-library/react'

vi.mock('@/components/ui/sonner', () => ({
  Toaster: vi.fn(() => <div data-testid="toaster" />),
}))

vi.mock('@/components/app-sidebar', () => ({
  AppSidebar: vi.fn(() => <div data-testid="app-sidebar" />),
}))

vi.mock('@/components/site-header', () => ({
  SiteHeader: vi.fn(() => <div data-testid="site-header" />),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: vi.fn(({ children, style }) => (
    <div data-testid="sidebar-provider" style={style}>
      {children}
    </div>
  )),
  SidebarInset: vi.fn(({ children }) => (
    <div data-testid="sidebar-inset">
      {children}
    </div>
  )),
}))

import { AdminLayout } from '../admin.layout'

describe('AdminLayout', () => {
  it('should render all layout components with correct structure', () => {
    // Arrange
    const testChildren = <div data-testid="test-children">Test Content</div>

    // Act
    render(<AdminLayout>{testChildren}</AdminLayout>)

    // Assert
    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument()
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
    expect(screen.getByTestId('site-header')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('should apply correct CSS custom properties to SidebarProvider', () => {
    // Arrange
    const testChildren = <div>Test Content</div>

    // Act
    render(<AdminLayout>{testChildren}</AdminLayout>)

    // Assert
    const sidebarProvider = screen.getByTestId('sidebar-provider')
    expect(sidebarProvider).toHaveStyle({
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    })
  })

  it('should render children content within SidebarInset', () => {
    // Arrange
    const testChildren = (
      <div data-testid="nested-content">
        <h1>Page Title</h1>
        <p>Page content goes here</p>
      </div>
    )

    // Act
    render(<AdminLayout>{testChildren}</AdminLayout>)

    // Assert
    const sidebarInset = screen.getByTestId('sidebar-inset')
    expect(sidebarInset).toContainElement(screen.getByTestId('nested-content'))
    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('Page content goes here')).toBeInTheDocument()
  })

  it('should render multiple children elements', () => {
    // Arrange
    const testChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </>
    )

    // Act
    render(<AdminLayout>{testChildren}</AdminLayout>)

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('should render with empty children', () => {
    // Arrange
    const testChildren = null

    // Act
    render(<AdminLayout>{testChildren}</AdminLayout>)

    // Assert
    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument()
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument()
    expect(screen.getByTestId('site-header')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })
})
