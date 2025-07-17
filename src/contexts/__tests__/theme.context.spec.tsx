import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { ThemeProvider, ThemeContext } from '../theme.context'
import * as useThemeModule from '@/hooks/useTheme'
import type { Dispatch, SetStateAction } from 'react'

type Theme = 'light' | 'dark'

const TestConsumer: React.FC = () => {
  const themeContext = useContext(ThemeContext)
  return (
    <div>
      <div data-testid="theme">{themeContext.theme}</div>
      <button data-testid="set-theme-btn" onClick={() => themeContext.setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="toggle-theme-btn" onClick={themeContext.toggleTheme}>
        Toggle Theme
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  const mockThemeState = {
    theme: 'light' as Theme,
    setTheme: vi.fn() as Dispatch<SetStateAction<Theme>>,
    toggleTheme: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(mockThemeState)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when provided', () => {
    // Arrange
    const testMessage = 'Test child component'
    
    // Act
    render(
      <ThemeProvider>
        <div data-testid="test-child">{testMessage}</div>
      </ThemeProvider>
    )

    // Assert
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText(testMessage)).toBeInTheDocument()
  })

  it('should call useTheme hook when provider is rendered', () => {
    // Arrange & Act
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    )

    // Assert
    expect(useThemeModule.useTheme).toHaveBeenCalledTimes(1)
  })

  it('should provide theme context with values from useTheme hook', () => {
    // Arrange
    const customThemeState = {
      theme: 'dark' as Theme,
      setTheme: vi.fn() as Dispatch<SetStateAction<Theme>>,
      toggleTheme: vi.fn(),
    }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(customThemeState)

    // Act
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // Assert
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('should provide theme context with light theme when useTheme returns light state', () => {
    // Arrange
    const lightThemeState = {
      theme: 'light' as Theme,
      setTheme: vi.fn() as Dispatch<SetStateAction<Theme>>,
      toggleTheme: vi.fn(),
    }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(lightThemeState)

    // Act
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // Assert
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('should provide working theme functions from useTheme hook', () => {
    // Arrange
    const mockSetTheme = vi.fn() as Dispatch<SetStateAction<Theme>>
    const mockToggleTheme = vi.fn()

    const themeStateWithFunctions = {
      theme: 'light' as Theme,
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
    }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(themeStateWithFunctions)

    // Act
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // Assert
    const setThemeBtn = screen.getByTestId('set-theme-btn')
    const toggleThemeBtn = screen.getByTestId('toggle-theme-btn')

    expect(setThemeBtn).toBeInTheDocument()
    expect(toggleThemeBtn).toBeInTheDocument()

    // Test that functions are callable
    setThemeBtn.click()
    expect(mockSetTheme).toHaveBeenCalledWith('dark')

    toggleThemeBtn.click()
    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple children correctly', () => {
    // Arrange
    const children = [
      <div key="1" data-testid="child-1">Child 1</div>,
      <div key="2" data-testid="child-2">Child 2</div>,
      <TestConsumer key="3" />,
    ]

    // Act
    render(<ThemeProvider>{children}</ThemeProvider>)

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('theme')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('should handle empty children gracefully', () => {
    // Arrange & Act
    const { container } = render(<ThemeProvider>{null}</ThemeProvider>)

    // Assert
    expect(container.firstChild).toBeNull()
    expect(useThemeModule.useTheme).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined children gracefully', () => {
    // Arrange & Act
    const { container } = render(<ThemeProvider>{undefined}</ThemeProvider>)

    // Assert
    expect(container.firstChild).toBeNull()
    expect(useThemeModule.useTheme).toHaveBeenCalledTimes(1)
  })

  it('should maintain context value reference when useTheme returns same object', () => {
    // Arrange
    const themeState = { ...mockThemeState }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(themeState)

    // Act
    const { rerender } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // Assert
    expect(useThemeModule.useTheme).toHaveBeenCalledTimes(1)

    // Re-render and verify hook is called again
    rerender(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    expect(useThemeModule.useTheme).toHaveBeenCalledTimes(2)
  })

  it('should handle theme switching between light and dark', () => {
    // Arrange
    const mockSetTheme = vi.fn() as Dispatch<SetStateAction<Theme>>
    const themeStateWithSetTheme = {
      theme: 'light' as Theme,
      setTheme: mockSetTheme,
      toggleTheme: vi.fn(),
    }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(themeStateWithSetTheme)

    // Act
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    const setThemeBtn = screen.getByTestId('set-theme-btn')
    setThemeBtn.click()

    // Assert
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should provide default theme context when useTheme returns default state', () => {
    // Arrange
    const defaultThemeState = {
      theme: 'light' as Theme,
      setTheme: (() => {}) as Dispatch<SetStateAction<Theme>>,
      toggleTheme: () => {},
    }
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(defaultThemeState)

    // Act
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )

    // Assert
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })
})
