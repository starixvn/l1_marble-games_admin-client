import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, className }) => (
    <button data-testid="button" onClick={onClick} data-variant={variant} className={className}>
      {children}
    </button>
  )),
}))

import { ErrorTable } from '../error-table'

describe('ErrorTable', () => {
  const originalLocation = window.location

  beforeEach(() => {
    delete (window as unknown as { location?: Location }).location
    window.location = { ...originalLocation, reload: vi.fn() }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('should render the error message and try again button', () => {
    // Arrange
    // Act
    render(<ErrorTable />)

    // Assert
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<ErrorTable />)

    // Assert
    const container = screen.getByText('Something went wrong').closest('div')?.parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-12', 'space-y-6')
  })

  it('should apply correct styling to error message', () => {
    // Arrange
    // Act
    render(<ErrorTable />)

    // Assert
    const errorMessage = screen.getByText('Something went wrong')
    expect(errorMessage).toHaveClass('text-lg', 'text-muted-foreground')
  })

  it('should apply correct styling to button', () => {
    // Arrange
    // Act
    render(<ErrorTable />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
    expect(button).toHaveClass('text-foreground', 'font-medium')
  })

  it('should call onClick when provided and button is clicked', () => {
    // Arrange
    const mockOnClick = vi.fn()
    // Act
    render(<ErrorTable onClick={mockOnClick} />)
    const button = screen.getByText('Try again')
    fireEvent.click(button)

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should reload page when no onClick is provided and button is clicked', () => {
    // Arrange
    // Act
    render(<ErrorTable />)
    const button = screen.getByText('Try again')
    fireEvent.click(button)

    // Assert
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when not provided', () => {
    // Arrange
    // Act
    render(<ErrorTable />)
    const button = screen.getByText('Try again')
    fireEvent.click(button)

    // Assert
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('should render with correct text content structure', () => {
    // Arrange
    // Act
    render(<ErrorTable />)

    // Assert
    const textContainer = screen.getByText('Something went wrong').parentElement
    expect(textContainer).toHaveClass('text-center', 'space-y-4')
  })

  it('should handle multiple button clicks correctly', () => {
    // Arrange
    const mockOnClick = vi.fn()
    // Act
    render(<ErrorTable onClick={mockOnClick} />)
    const button = screen.getByText('Try again')
    
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(3)
  })
})
