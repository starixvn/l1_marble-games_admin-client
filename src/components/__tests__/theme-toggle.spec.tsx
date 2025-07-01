import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('lucide-react', () => ({
  Moon: vi.fn(() => <div data-testid="moon-icon" />),
  Sun: vi.fn(() => <div data-testid="sun-icon" />),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, variant, size, onClick, className }) => (
    <button type='button' data-testid="button" data-variant={variant} data-size={size} onClick={onClick} className={className}>
      {children}
    </button>
  )),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(),
  }
})

import { ThemeToggle } from '../theme-toggle'
import { useContext } from 'react'

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContext).mockReturnValue({ 
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme 
    })
  })

  it('should render the theme toggle button', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)

    // Assert
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('should apply correct button props', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
    expect(button).toHaveAttribute('data-size', 'icon')
    expect(button).toHaveClass('relative')
  })

  it('should call toggleTheme when button is clicked', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)
    const button = screen.getByTestId('button')
    fireEvent.click(button)

    // Assert
    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('should render screen reader text', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)

    // Assert
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toHaveClass('sr-only')
  })

  it('should render both sun and moon icons', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)

    // Assert
    const sunIcon = screen.getByTestId('sun-icon')
    const moonIcon = screen.getByTestId('moon-icon')
    expect(sunIcon).toBeInTheDocument()
    expect(moonIcon).toBeInTheDocument()
  })

  it('should handle multiple clicks correctly', () => {
    // Arrange
    // Act
    render(<ThemeToggle />)
    const button = screen.getByTestId('button')
    
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    // Assert
    expect(mockToggleTheme).toHaveBeenCalledTimes(3)
  })
}) 