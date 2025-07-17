import { render, screen } from '@testing-library/react'

vi.mock('@tabler/icons-react', () => ({
  IconHome: vi.fn(() => <div data-testid="icon-home" />),
  IconUser: vi.fn(() => <div data-testid="icon-user" />),
  IconSettings: vi.fn(() => <div data-testid="icon-settings" />),
}))

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({ pathname: '/' })),
  Link: vi.fn(({ children, to, replace }) => (
    <a data-testid="link" href={to} data-replace={replace}>
      {children}
    </a>
  )),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarGroup: vi.fn(({ children }) => <div data-testid="sidebar-group">{children}</div>),
  SidebarGroupContent: vi.fn(({ children, className }) => (
    <div data-testid="sidebar-group-content" className={className}>
      {children}
    </div>
  )),
  SidebarMenu: vi.fn(({ children }) => <div data-testid="sidebar-menu">{children}</div>),
  SidebarMenuButton: vi.fn(({ children, tooltip, asChild, className }) => (
    <div data-testid="sidebar-menu-button" data-tooltip={tooltip} data-as-child={asChild} className={className}>
      {children}
    </div>
  )),
  SidebarMenuItem: vi.fn(({ children }) => <div data-testid="sidebar-menu-item">{children}</div>),
}))

import { NavMain } from '../nav-main'
import { useLocation } from 'react-router-dom'
import { IconHome, IconUser, IconSettings } from '@tabler/icons-react'

describe('NavMain', () => {
  const mockItems = [
    { title: 'Home', url: '/', icon: IconHome },
    { title: 'Operators', url: '/operators', icon: IconUser },
    { title: 'Settings', url: '/settings', icon: IconSettings },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the navigation menu with correct structure', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-group-content')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument()
  })

  it('should render navigation items for each item in the list', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuItems = screen.getAllByTestId('sidebar-menu-item')
    expect(menuItems).toHaveLength(3)
  })

  it('should render navigation links with correct URLs', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const links = screen.getAllByTestId('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '/')
    expect(links[1]).toHaveAttribute('href', '/operators')
    expect(links[2]).toHaveAttribute('href', '/settings')
  })

  it('should render navigation item titles', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Operators')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to sidebar group content', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const groupContent = screen.getByTestId('sidebar-group-content')
    expect(groupContent).toHaveClass('flex', 'flex-col', 'gap-2')
  })

  it('should mark active item when pathname matches exactly', () => {
    // Arrange
    vi.mocked(useLocation).mockReturnValue({ pathname: '/operators' } as unknown as ReturnType<typeof useLocation>)
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuButtons = screen.getAllByTestId('sidebar-menu-button')
    expect(menuButtons[1]).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('should mark home as active when pathname is root', () => {
    // Arrange
    vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as unknown as ReturnType<typeof useLocation>)
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuButtons = screen.getAllByTestId('sidebar-menu-button')
    expect(menuButtons[0]).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('should mark item as active when pathname starts with item URL', () => {
    // Arrange
    vi.mocked(useLocation).mockReturnValue({ pathname: '/operators/123' } as unknown as ReturnType<typeof useLocation>)
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuButtons = screen.getAllByTestId('sidebar-menu-button')
    expect(menuButtons[1]).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('should apply tooltip to menu buttons', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuButtons = screen.getAllByTestId('sidebar-menu-button')
    expect(menuButtons[0]).toHaveAttribute('data-tooltip', 'Home')
    expect(menuButtons[1]).toHaveAttribute('data-tooltip', 'Operators')
    expect(menuButtons[2]).toHaveAttribute('data-tooltip', 'Settings')
  })

  it('should set asChild prop on menu buttons', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const menuButtons = screen.getAllByTestId('sidebar-menu-button')
    menuButtons.forEach(button => {
      expect(button).toHaveAttribute('data-as-child', 'true')
    })
  })

  it('should set replace prop on links', () => {
    // Arrange
    // Act
    render(<NavMain items={mockItems} />)

    // Assert
    const links = screen.getAllByTestId('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('data-replace', 'true')
    })
  })

  it('should handle items without icons', () => {
    // Arrange
    const itemsWithoutIcons = [
      { title: 'Home', url: '/' },
      { title: 'About', url: '/about' },
    ]
    // Act
    render(<NavMain items={itemsWithoutIcons} />)

    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
}) 