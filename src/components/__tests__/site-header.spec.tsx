import { render, screen } from '@testing-library/react'

vi.mock('@/components/ui/separator', () => ({
  Separator: vi.fn(({ orientation, className }) => (
    <div data-testid="separator" data-orientation={orientation} className={className} />
  )),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: vi.fn(({ className }) => <div data-testid="sidebar-trigger" className={className} />),
}))

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: vi.fn(() => <div data-testid="theme-toggle" />),
}))

import { SiteHeader } from '../site-header'

describe('SiteHeader', () => {
  it('should render the site header with correct structure', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('separator')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to header', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('flex', 'h-(--header-height)', 'shrink-0', 'items-center', 'gap-2', 'border-b', 'transition-[width,height]', 'ease-linear', 'group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)')
  })

  it('should apply correct CSS classes to sidebar trigger', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    const sidebarTrigger = screen.getByTestId('sidebar-trigger')
    expect(sidebarTrigger).toHaveClass('-ml-1')
  })

  it('should apply correct props to separator', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    const separator = screen.getByTestId('separator')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('mx-2', 'data-[orientation=vertical]:h-4')
  })

  it('should render theme toggle in the correct position', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    const themeToggle = screen.getByTestId('theme-toggle')
    expect(themeToggle).toBeInTheDocument()
  })

  it('should have correct layout structure', () => {
    // Arrange
    // Act
    render(<SiteHeader />)

    // Assert
    const header = screen.getByRole('banner')
    const container = header.querySelector('.flex.w-full')
    expect(container).toHaveClass('flex', 'w-full', 'items-center', 'gap-1', 'lg:gap-2', 'pl-4', 'lg:pl-6', 'mr-2')
  })
}) 