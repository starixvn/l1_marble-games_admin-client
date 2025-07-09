import { render, screen } from '@testing-library/react'

vi.mock('@/components/nav-main', () => ({
  NavMain: vi.fn(({ items }) => <div data-testid="nav-main">{JSON.stringify(items)}</div>),
}))

vi.mock('@/components/nav-user', () => ({
  NavUser: vi.fn(({ user }) => <div data-testid="nav-user">{JSON.stringify(user)}</div>),
}))

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: vi.fn(({ children, collapsible, className, ...props }) => (
    <div data-testid="sidebar" data-collapsible={collapsible} className={className} {...props}>
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

// Mock the useMenu hook
vi.mock('@/hooks/useMenu', () => ({
  useMenu: vi.fn(),
}))

import { AppSidebar } from '../app-sidebar'
import { useMenu } from '@/hooks/useMenu'

describe('AppSidebar', () => {
  const mockUseMenu = useMenu as ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Default mock implementation
    mockUseMenu.mockReturnValue({
      menu: [
        { title: 'Home', url: '/', icon: 'IconHome' },
        { title: 'Operators', url: '/operators', icon: 'IconUser' },
        { title: 'Game Configs', url: '/game-configs', icon: 'IconSettings' },
        { title: 'Game Integrations', url: '/game-integrations', icon: 'IconCode' },
        { title: 'Game Config Schemas', url: '/game-config-schemas', icon: 'IconCode' },
        { title: 'Api Logs', url: '/logs-api', icon: 'IconCode' },
        { title: 'Admin Log', url: '/admin-log', icon: 'IconCode' },
      ],
      isLoading: false,
      profile: 'admin',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

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

  it('should render NavMain with filtered menu items from useMenu hook', () => {
    // Arrange
    const mockMenu = [
      { title: 'Home', url: '/', icon: 'IconHome' },
      { title: 'Operators', url: '/operators', icon: 'IconUser' },
    ]
    mockUseMenu.mockReturnValue({
      menu: mockMenu,
      isLoading: false,
      profile: 'admin',
    })

    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-main')).toBeInTheDocument()
    const navMainContent = screen.getByTestId('nav-main').textContent
    expect(navMainContent).toContain('Home')
    expect(navMainContent).toContain('Operators')
    expect(navMainContent).not.toContain('Game Configs')
  })

  it('should render NavUser with profile data from useMenu hook', () => {
    // Arrange
    mockUseMenu.mockReturnValue({
      menu: [],
      isLoading: false,
      profile: 'testuser',
    })

    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-user')).toBeInTheDocument()
    const navUserContent = screen.getByTestId('nav-user').textContent
    expect(navUserContent).toContain('testuser')
  })

  it('should show loading state with opacity when isLoading is true', () => {
    // Arrange
    mockUseMenu.mockReturnValue({
      menu: [],
      isLoading: true,
      profile: 'admin',
    })

    // Act
    render(<AppSidebar />)

    // Assert
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('opacity-50')
  })

  it('should not show loading state when isLoading is false', () => {
    // Arrange
    mockUseMenu.mockReturnValue({
      menu: [],
      isLoading: false,
      profile: 'admin',
    })

    // Act
    render(<AppSidebar />)

    // Assert
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).not.toHaveClass('opacity-50')
  })

  it('should handle empty menu when user has no permissions', () => {
    // Arrange
    mockUseMenu.mockReturnValue({
      menu: [],
      isLoading: false,
      profile: 'restricted-user',
    })

    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-main')).toBeInTheDocument()
    const navMainContent = screen.getByTestId('nav-main').textContent
    expect(navMainContent).toBe('[]')
  })

  it('should handle undefined profile gracefully', () => {
    // Arrange
    mockUseMenu.mockReturnValue({
      menu: [],
      isLoading: false,
      profile: undefined,
    })

    // Act
    render(<AppSidebar />)

    // Assert
    expect(screen.getByTestId('nav-user')).toBeInTheDocument()
    const navUserContent = screen.getByTestId('nav-user').textContent
    expect(navUserContent).toContain('""')
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

  it('should call useMenu hook when component renders', () => {
    // Arrange
    // Act
    render(<AppSidebar />)

    // Assert
    expect(mockUseMenu).toHaveBeenCalledTimes(1)
  })
})
