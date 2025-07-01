import { render, screen } from '@testing-library/react'

vi.mock('@/components/nav-main', () => ({
  NavMain: vi.fn(({ items }) => <div data-testid="nav-main">{JSON.stringify(items)}</div>),
}))

vi.mock('@/components/nav-user', () => ({
  NavUser: vi.fn(({ user }) => <div data-testid="nav-user">{JSON.stringify(user)}</div>),
}))

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: vi.fn(({ children, collapsible, ...props }) => (
    <div data-testid="sidebar" data-collapsible={collapsible} {...props}>
      {children}
    </div>
  )),
  SidebarContent: vi.fn(({ children }) => <div data-testid="sidebar-content">{children}</div>),
  SidebarFooter: vi.fn(({ children }) => <div data-testid="sidebar-footer">{children}</div>),
  SidebarHeader: vi.fn(({ children }) => <div data-testid="sidebar-header">{children}</div>),
  SidebarMenu: vi.fn(({ children }) => <div data-testid="sidebar-menu">{children}</div>),
  SidebarMenuItem: vi.fn(({ children }) => <div data-testid="sidebar-menu-item">{children}</div>),
  SidebarMenuButton: vi.fn(({ children, className, asChild }) => (
    <div data-testid="sidebar-menu-button" className={className} data-as-child={asChild}>
      {children}
    </div>
  )),
}))

import { AppSidebar } from '../app-sidebar'

describe('AppSidebar', () => {
  it('should render the sidebar with correct structure', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument()
  })

  it('should render sidebar with correct collapsible prop', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveAttribute('data-collapsible', 'offcanvas')
  })

  it('should render the header with admin site title', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByText('Admin Site')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-menu-button')).toBeInTheDocument()
  })

  it('should apply correct styling to menu button', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    const menuButton = screen.getByTestId('sidebar-menu-button')
    expect(menuButton).toHaveClass('data-[slot=sidebar-menu-button]:!p-1.5')
    expect(menuButton).toHaveAttribute('data-as-child', 'true')
  })

  it('should render NavMain with correct navigation items', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-main')).toBeInTheDocument()
    const navMainContent = screen.getByTestId('nav-main').textContent
    expect(navMainContent).toContain('Home')
    expect(navMainContent).toContain('Operators')
    expect(navMainContent).toContain('Game Configs')
    expect(navMainContent).toContain('Game Integrations')
    expect(navMainContent).toContain('Game Config Schemas')
  })

  it('should render NavUser with correct user data', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-user')).toBeInTheDocument()
    const navUserContent = screen.getByTestId('nav-user').textContent
    expect(navUserContent).toContain('admin')
  })

  it('should pass through additional props to Sidebar', () => {
    // Arrange
    const customProps = { 'data-custom': 'value', className: 'custom-class' }

    // Act
    render(<AppSidebar {...customProps} />)

    // Assert
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveAttribute('data-custom', 'value')
    expect(sidebar).toHaveClass('custom-class')
  })

  it('should render all sidebar sections in correct order', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    const sidebar = screen.getByTestId('sidebar')
    const header = screen.getByTestId('sidebar-header')
    const content = screen.getByTestId('sidebar-content')
    const footer = screen.getByTestId('sidebar-footer')

    expect(sidebar).toContainElement(header)
    expect(sidebar).toContainElement(content)
    expect(sidebar).toContainElement(footer)
  })
})
