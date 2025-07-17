import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ height, width, defaultLanguage, value, theme, onChange, options }) => (
    <div data-testid="monaco-editor" data-height={height} data-width={width} data-language={defaultLanguage} data-theme={theme}>
      <textarea
        data-testid="editor-textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Monaco Editor"
      />
      <div data-testid="editor-options">
        {JSON.stringify(options)}
      </div>
    </div>
  )),
}))

vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

vi.mock('@/contexts/theme.context', () => ({
  ThemeContext: {
    Consumer: vi.fn(({ children }) => children({ theme: 'light' })),
  },
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(() => ({ theme: 'light' })),
  }
})

import { JsonEditorWithDragDrop } from '../json-editor-with-drag-drop'
import { useContext } from 'react'

describe('JsonEditorWithDragDrop', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContext).mockReturnValue({ theme: 'light' })
  })

  it('should render the JSON editor with correct structure', () => {
    // Arrange
    const props = {
      value: '{"test": "value"}',
      onChange: mockOnChange,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByTestId('editor-textarea')).toBeInTheDocument()
  })

  it('should render with default props', () => {
    // Arrange
    // Act
    render(<JsonEditorWithDragDrop value="{}" />)

    // Assert
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-height', '50vh')
    expect(editor).toHaveAttribute('data-width', '100%')
    expect(editor).toHaveAttribute('data-language', 'json')
    expect(editor).toHaveAttribute('data-theme', 'light')
  })

  it('should render with custom height', () => {
    // Arrange
    const props = {
      value: '{}',
      height: '100vh',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-height', '100vh')
  })

  it('should render with custom value', () => {
    // Arrange
    const props = {
      value: '{"custom": "value"}',
      onChange: mockOnChange,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const textarea = screen.getByTestId('editor-textarea')
    expect(textarea).toHaveValue('{"custom": "value"}')
  })

  it('should call onChange when editor value changes', () => {
    // Arrange
    const props = {
      value: '{}',
      onChange: mockOnChange,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)
    const textarea = screen.getByTestId('editor-textarea')
    fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

    // Assert
    expect(mockOnChange).toHaveBeenCalledWith('{"new": "value"}')
  })

  it('should render with dark theme when theme context is dark', () => {
    // Arrange
    vi.mocked(useContext).mockReturnValue({ theme: 'dark' })
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-theme', 'vs-dark')
  })

  it('should render with light theme when theme context is light', () => {
    // Arrange
    vi.mocked(useContext).mockReturnValue({ theme: 'light' })
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-theme', 'light')
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    const props = {
      value: '{}',
      className: 'custom-class',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const container = screen.getByTestId('monaco-editor').closest('section')
    expect(container).toHaveClass('w-full', 'min-w-0', 'relative', 'border-2', 'border-dashed', 'transition-colors', 'border-transparent', 'custom-class')
  })

  it('should show loading component when isLoading is true', () => {
    // Arrange
    const props = {
      value: '{}',
      isLoading: true,
      loadingComponent: <div data-testid="loading">Loading...</div>,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('monaco-editor')).not.toBeInTheDocument()
  })

  it('should show error component when isError is true', () => {
    // Arrange
    const props = {
      value: '{}',
      isError: true,
      errorComponent: <div data-testid="error">Error</div>,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.queryByTestId('monaco-editor')).not.toBeInTheDocument()
  })

  it('should show default loading component when isLoading is true', () => {
    // Arrange
    const props = {
      value: '{}',
      isLoading: true,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show default error component when isError is true', () => {
    // Arrange
    const props = {
      value: '{}',
      isError: true,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should have correct Monaco editor options', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const optionsElement = screen.getByTestId('editor-options')
    const options = JSON.parse(optionsElement.textContent ?? '{}')
    expect(options).toEqual({
      automaticLayout: true,
      readOnly: false,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    })
  })

  it('should handle drag over event', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)
    const container = screen.getByTestId('monaco-editor').closest('section')
    if (container) {
      fireEvent.dragOver(container)
    }

    // Assert
    expect(container).toHaveClass('border-blue-400', 'bg-blue-50/10')
  })

  it('should handle drag leave event', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)
    const container = screen.getByTestId('monaco-editor').closest('section')
    if (container) {
      fireEvent.dragOver(container)
      fireEvent.dragLeave(container)
    }

    // Assert
    expect(container).toHaveClass('w-full min-w-0 relative border-2 border-dashed transition-colors border-blue-400 bg-blue-50/10')
  })

  it('should show drop message when dragging', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)
    const container = screen.getByTestId('monaco-editor').closest('section')
    if (container) {
      fireEvent.dragOver(container)
    }

    // Assert
    expect(screen.getByText('Drop JSON file here')).toBeInTheDocument()
  })

  it('should have correct aria-label', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const container = screen.getByTestId('monaco-editor').closest('section')
    expect(container).toHaveAttribute('aria-label', 'JSON file drop zone')
  })

  it('should handle empty value', () => {
    // Arrange
    const props = {
      value: '',
      onChange: mockOnChange,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const textarea = screen.getByTestId('editor-textarea')
    expect(textarea).toHaveValue('')
  })

  it('should handle complex JSON value', () => {
    // Arrange
    const complexJson = JSON.stringify({
      nested: {
        array: [1, 2, 3],
        object: { key: 'value' },
        boolean: true,
        null: null,
        number: 42,
        string: 'test',
      },
    })
    const props = {
      value: complexJson,
      onChange: mockOnChange,
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const textarea = screen.getByTestId('editor-textarea')
    expect(textarea).toHaveValue(complexJson)
  })

  it('should handle onChange being undefined', () => {
    // Arrange
    const props = {
      value: '{}',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)
    const textarea = screen.getByTestId('editor-textarea')
    fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

    // Assert
    // Should not throw error when onChange is undefined
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('should handle different height values', () => {
    // Arrange
    const heights = ['100px', '50vh', '100vh', '200px']

    // Act & Assert
    heights.forEach(height => {
      render(<JsonEditorWithDragDrop value="{}" height={height} />)
      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-height', height)
      cleanup()
    })
  })

  it('should handle different className values', () => {
    // Arrange
    const props = {
      value: '{}',
      className: 'test-class another-class',
    }

    // Act
    render(<JsonEditorWithDragDrop {...props} />)

    // Assert
    const container = screen.getByTestId('monaco-editor').closest('section')
    expect(container).toHaveClass('test-class', 'another-class')
  })

  describe('readOnly functionality', () => {
    it('should render with readOnly prop set to true', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)

      // Assert
      const optionsElement = screen.getByTestId('editor-options')
      const options = JSON.parse(optionsElement.textContent ?? '{}')
      expect(options.readOnly).toBe(true)
    })

    it('should render with readOnly prop set to false', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: false,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)

      // Assert
      const optionsElement = screen.getByTestId('editor-options')
      const options = JSON.parse(optionsElement.textContent ?? '{}')
      expect(options.readOnly).toBe(false)
    })

    it('should default readOnly to false when not provided', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)

      // Assert
      const optionsElement = screen.getByTestId('editor-options')
      const options = JSON.parse(optionsElement.textContent ?? '{}')
      expect(options.readOnly).toBe(false)
    })

    it('should not show drop message when dragging in readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const container = screen.getByTestId('monaco-editor').closest('section')
      if (container) {
        fireEvent.dragOver(container)
      }

      // Assert
      expect(screen.queryByText('Drop JSON file here')).not.toBeInTheDocument()
    })

    it('should show drop message when dragging in non-readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: false,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const container = screen.getByTestId('monaco-editor').closest('section')
      if (container) {
        fireEvent.dragOver(container)
      }

      // Assert
      expect(screen.getByText('Drop JSON file here')).toBeInTheDocument()
    })

    it('should not call onChange when editor value changes in readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
        onChange: mockOnChange,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const textarea = screen.getByTestId('editor-textarea')
      fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

      // Assert
      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should call onChange when editor value changes in non-readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: false,
        onChange: mockOnChange,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const textarea = screen.getByTestId('editor-textarea')
      fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('{"new": "value"}')
    })

    it('should not apply drag styling in readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const container = screen.getByTestId('monaco-editor').closest('section')
      if (container) {
        fireEvent.dragOver(container)
      }

      // Assert
      expect(container).not.toHaveClass('border-blue-400', 'bg-blue-50/10')
    })

    it('should apply drag styling in non-readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: false,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const container = screen.getByTestId('monaco-editor').closest('section')
      if (container) {
        fireEvent.dragOver(container)
      }

      // Assert
      expect(container).toHaveClass('border-blue-400', 'bg-blue-50/10')
    })

    it('should handle drag leave in readonly mode', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)
      const container = screen.getByTestId('monaco-editor').closest('section')
      if (container) {
        fireEvent.dragOver(container)
        fireEvent.dragLeave(container)
      }

      // Assert
      // Should not have drag styling since readonly mode doesn't show drag state
      expect(container).toHaveClass('w-full min-w-0 relative border-2 border-dashed transition-colors border-transparent')
    })

    it('should maintain all other Monaco editor options when readonly is true', () => {
      // Arrange
      const props = {
        value: '{"test": "value"}',
        readOnly: true,
      }

      // Act
      render(<JsonEditorWithDragDrop {...props} />)

      // Assert
      const optionsElement = screen.getByTestId('editor-options')
      const options = JSON.parse(optionsElement.textContent ?? '{}')
      expect(options).toEqual({
        automaticLayout: true,
        readOnly: true,
        wordWrap: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      })
    })
  })
}) 