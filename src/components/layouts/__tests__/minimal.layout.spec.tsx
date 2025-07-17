import { render, screen } from '@testing-library/react'

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: vi.fn(() => <div data-testid="theme-toggle" />),
}))

vi.mock('@/components/ui/sonner', () => ({
  Toaster: vi.fn(() => <div data-testid="toaster" />),
}))

import { MinimalLayout } from '../minimal.layout'

describe('MinimalLayout', () => {
  it('should render all layout components with correct structure', () => {
    // Arrange
    const testChildren = <div data-testid="test-children">Test Content</div>

    // Act
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to main container', () => {
    // Arrange
    const testChildren = <div data-testid="test-children">Test Content</div>

    // Act
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    const mainContainer = screen.getByTestId('test-children').parentElement?.parentElement
    expect(mainContainer).toHaveClass('flex', 'min-h-svh', 'w-full', 'items-center', 'justify-center', 'p-6', 'md:p-10')
  })

  it('should position theme toggle in top-right corner', () => {
    // Arrange
    const testChildren = <div>Test Content</div>

    // Act
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    const themeToggleContainer = screen.getByTestId('theme-toggle').parentElement
    expect(themeToggleContainer).toHaveClass('absolute', 'top-6', 'right-6')
  })

  it('should render children content with correct width constraints', () => {
    // Arrange
    const testChildren = (
      <div data-testid="nested-content">
        <h1>Login Form</h1>
        <p>Please enter your credentials</p>
      </div>
    )

    // Act
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    const childrenContainer = screen.getByTestId('nested-content').parentElement
    expect(childrenContainer).toHaveClass('w-full', 'max-w-sm')
    expect(screen.getByText('Login Form')).toBeInTheDocument()
    expect(screen.getByText('Please enter your credentials')).toBeInTheDocument()
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
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('should render with empty children', () => {
    // Arrange
    const testChildren = null

    // Act
    render(<MinimalLayout>{testChildren}</MinimalLayout>)

    // Assert
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })
})
