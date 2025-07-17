import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@tabler/icons-react', () => ({
  IconDotsVertical: vi.fn(({ className }) => <div data-testid="dots-icon" className={className} />),
  IconLogout: vi.fn(() => <div data-testid="logout-icon" />),
  IconLock: vi.fn(() => <div data-testid="lock-icon" />),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: vi.fn(({ children }) => <div data-testid="dropdown-menu">{children}</div>),
  DropdownMenuContent: vi.fn(({ children, className, side, align, sideOffset }) => (
    <div data-testid="dropdown-menu-content" className={className} data-side={side} data-align={align} data-side-offset={sideOffset}>
      {children}
    </div>
  )),
  DropdownMenuItem: vi.fn(({ children, onClick }) => (
    <button data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </button>
  )),
  DropdownMenuTrigger: vi.fn(({ children, asChild }) => (
    <div data-testid="dropdown-menu-trigger" data-as-child={asChild}>
      {children}
    </div>
  )),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: vi.fn(({ children }) => <div data-testid="sidebar-menu">{children}</div>),
  SidebarMenuButton: vi.fn(({ children, size, className }) => (
    <button data-testid="sidebar-menu-button" data-size={size} className={className}>
      {children}
    </button>
  )),
  SidebarMenuItem: vi.fn(({ children }) => <div data-testid="sidebar-menu-item">{children}</div>),
  useSidebar: vi.fn(() => ({
    isMobile: false,
    state: 'expanded',
    open: false,
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile: vi.fn(),
    toggleSidebar: vi.fn(),
  })),
}))

vi.mock('@/components/change-password-dropdown', () => ({
  ChangePassword: vi.fn(({ open, onOpenChange }) => (
    <div data-testid="change-password-dialog" data-open={open}>
      <button data-testid="change-password-trigger" onClick={() => onOpenChange?.(!open)}>
        Change Password Dialog
      </button>
    </div>
  )),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(),
  }
})

import { NavUser } from '../nav-user'
import { useContext } from 'react'
import { useSidebar } from '@/components/ui/sidebar'

describe('NavUser', () => {
  const mockUser = {
    name: 'John Doe',
  }

  const mockHandleLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContext).mockReturnValue({
      user: mockUser,
      handleLogout: mockHandleLogout,
    } as ReturnType<typeof useContext>)
  })

  it('should render the navigation user component with correct structure', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-menu-item')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-menu-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-menu-button')).toBeInTheDocument()
  })

  it('should display the user name', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render the dots vertical icon', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    expect(screen.getByTestId('dots-icon')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to sidebar menu button', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const menuButton = screen.getByTestId('sidebar-menu-button')
    expect(menuButton).toHaveAttribute('data-size', 'lg')
    expect(menuButton).toHaveClass('data-[state=open]:bg-sidebar-accent', 'data-[state=open]:text-sidebar-accent-foreground')
  })

  it('should render dropdown menu content with correct props', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const dropdownContent = screen.getByTestId('dropdown-menu-content')
    expect(dropdownContent).toHaveClass('w-(--radix-dropdown-menu-trigger-width)', 'min-w-56', 'rounded-lg')
    expect(dropdownContent).toHaveAttribute('data-side', 'right')
    expect(dropdownContent).toHaveAttribute('data-align', 'end')
    expect(dropdownContent).toHaveAttribute('data-side-offset', '4')
  })

  it('should render logout menu item with icon', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const logoutMenuItem = screen.getByText('Log out')
    expect(logoutMenuItem).toBeInTheDocument()
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('should call handleLogout when logout menu item is clicked', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)
    const logoutMenuItem = screen.getByText('Log out')
    fireEvent.click(logoutMenuItem)

    // Assert
    expect(mockHandleLogout).toHaveBeenCalledTimes(1)
  })

  it('should render change password menu item with icon', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const changePasswordMenuItem = screen.getByText('Change Password')
    expect(changePasswordMenuItem).toBeInTheDocument()
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
  })

  it('should open change password dialog when change password menu item is clicked', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)
    const changePasswordMenuItem = screen.getByText('Change Password')
    fireEvent.click(changePasswordMenuItem)

    // Assert
    expect(screen.getByTestId('change-password-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('change-password-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should render change password dialog component', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    expect(screen.getByTestId('change-password-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('change-password-dialog')).toHaveAttribute('data-open', 'false')
  })

  it('should handle change password dialog state changes', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)
    
    // Initially closed
    expect(screen.getByTestId('change-password-dialog')).toHaveAttribute('data-open', 'false')
    
    // Open dialog
    const changePasswordMenuItem = screen.getByText('Change Password')
    fireEvent.click(changePasswordMenuItem)
    expect(screen.getByTestId('change-password-dialog')).toHaveAttribute('data-open', 'true')
    
    // Close dialog via trigger
    const dialogTrigger = screen.getByTestId('change-password-trigger')
    fireEvent.click(dialogTrigger)
    expect(screen.getByTestId('change-password-dialog')).toHaveAttribute('data-open', 'false')
  })

  it('should set asChild prop on dropdown menu trigger', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const dropdownTrigger = screen.getByTestId('dropdown-menu-trigger')
    expect(dropdownTrigger).toHaveAttribute('data-as-child', 'true')
  })

  it('should apply correct CSS classes to user name container', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const nameContainer = screen.getByText('John Doe').closest('div')
    expect(nameContainer).toHaveClass('grid', 'flex-1', 'text-left', 'text-sm', 'leading-tight')
  })

  it('should apply correct CSS classes to user name span', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const nameSpan = screen.getByText('John Doe')
    expect(nameSpan).toHaveClass('truncate', 'font-medium')
  })

  it('should apply correct CSS classes to dots icon', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const dotsIcon = screen.getByTestId('dots-icon')
    expect(dotsIcon).toHaveClass('ml-auto', 'size-4')
  })

  it('should use mobile side prop when isMobile is true', () => {
    // Arrange
    vi.mocked(useSidebar).mockReturnValue({
      isMobile: true,
      state: 'expanded',
      open: false,
      setOpen: vi.fn(),
      openMobile: false,
      setOpenMobile: vi.fn(),
      toggleSidebar: vi.fn(),
    })

    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const dropdownContent = screen.getByTestId('dropdown-menu-content')
    expect(dropdownContent).toHaveAttribute('data-side', 'bottom')
  })

  it('should handle different user names', () => {
    // Arrange
    const differentUser = { name: 'Jane Smith' }

    // Act
    render(<NavUser user={differentUser} />)

    // Assert
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should handle long user names with truncation', () => {
    // Arrange
    const longNameUser = { name: 'Very Long User Name That Should Be Truncated' }

    // Act
    render(<NavUser user={longNameUser} />)

    // Assert
    expect(screen.getByText('Very Long User Name That Should Be Truncated')).toBeInTheDocument()
    expect(screen.getByText('Very Long User Name That Should Be Truncated')).toHaveClass('truncate')
  })

  it('should render both logout and change password menu items in correct order', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    const menuItems = screen.getAllByTestId('dropdown-menu-item')
    expect(menuItems).toHaveLength(2)
    
    // Check that logout comes first, then change password
    expect(menuItems[0]).toHaveTextContent('Log out')
    expect(menuItems[1]).toHaveTextContent('Change Password')
  })

  it('should have correct icons for both menu items', () => {
    // Arrange
    // Act
    render(<NavUser user={mockUser} />)

    // Assert
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
  })
}) 