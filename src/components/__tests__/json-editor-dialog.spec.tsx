import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, variant, onClick, disabled }) => (
    <button data-testid="button" data-variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  )),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  )),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <h2 data-testid="dialog-title">{children}</h2>),
  DialogDescription: vi.fn(({ children }) => <p data-testid="dialog-description">{children}</p>),
}))

vi.mock('@/components/json-editor-with-drag-drop', () => ({
  JsonEditorWithDragDrop: vi.fn(({ value, onChange, isLoading, isError, readOnly }) => (
    <div data-testid="json-editor-with-drag-drop" data-loading={isLoading} data-error={isError} data-readonly={readOnly}>
      <textarea
        data-testid="json-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter JSON here"
        readOnly={readOnly}
      />
    </div>
  )),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

import { JsonEditorDialog } from '../json-editor-dialog'
import { toast } from 'sonner'

describe('JsonEditorDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the dialog with correct structure', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument()
    expect(screen.getByTestId('json-editor-with-drag-drop')).toBeInTheDocument()
  })

  it('should render dialog with correct open state', () => {
    // Arrange
    const props = {
      isOpen: false,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('should render with default title and description', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    expect(screen.getByText('JSON Editor')).toBeInTheDocument()
    expect(screen.getByText('Paste json below or drag and drop file')).toBeInTheDocument()
  })

  it('should render with custom title and description', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      title: 'Custom Title',
      description: 'Custom Description',
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Description')).toBeInTheDocument()
  })

  it('should render with default initial value', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId('json-textarea')
    expect(textarea).toHaveValue('{}')
  })

  it('should render with custom initial value', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: '{"test": "value"}',
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId('json-textarea')
    expect(textarea).toHaveValue('{"test": "value"}')
  })

  it('should render OK and Cancel buttons', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to dialog content', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const dialogContent = screen.getByTestId('dialog-content')
    expect(dialogContent).toHaveClass('max-w-4xl')
  })

  it('should apply correct CSS classes to button container', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const buttonContainer = screen.getByText('OK').closest('div')
    expect(buttonContainer).toHaveClass('flex', 'justify-end', 'pt-4', 'gap-2')
  })

  it('should apply correct variant to Cancel button', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const buttons = screen.getAllByTestId('button')
    const cancelButton = buttons.find(button => button.textContent === 'Cancel')
    expect(cancelButton).toHaveAttribute('data-variant', 'outline')
  })

  it('should call onOpenChange when Cancel button is clicked', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should call onSubmit with valid JSON when OK button is clicked', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: '{"test": "value"}',
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('{"test": "value"}')
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should show error toast when invalid JSON is submitted', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: 'invalid json',
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Invalid JSON format')
    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(mockOnOpenChange).not.toHaveBeenCalled()
  })

  it('should handle JSON editor value changes', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const textarea = screen.getByTestId('json-textarea')
    fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

    // Assert
    expect(textarea).toHaveValue('{"new": "value"}')
  })

  it('should submit updated JSON value', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const textarea = screen.getByTestId('json-textarea')
    fireEvent.change(textarea, { target: { value: '{"updated": "value"}' } })
    
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('{"updated": "value"}')
  })

  it('should reset editor value when dialog opens', () => {
    // Arrange
    const { rerender } = render(
      <JsonEditorDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        initialValue="{}"
      />
    )

    // Act
    rerender(
      <JsonEditorDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        initialValue="{}"
      />
    )

    // Assert
    const textarea = screen.getByTestId('json-textarea')
    expect(textarea).toHaveValue('{}')
  })

  it('should pass loading state to JSON editor', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isLoading: true,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    expect(jsonEditor).toHaveAttribute('data-loading', 'true')
  })

  it('should pass error state to JSON editor', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isError: true,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    expect(jsonEditor).toHaveAttribute('data-error', 'true')
  })

  it('should handle complex JSON objects', () => {
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
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: complexJson,
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(complexJson)
  })

  it('should handle empty JSON object', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: '{}',
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('{}')
  })

  it('should handle JSON array', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: '[1, 2, 3]',
    }

    // Act
    render(<JsonEditorDialog {...props} />)
    const okButton = screen.getByText('OK')
    fireEvent.click(okButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('[1, 2, 3]')
  })

  it('should handle multiple dialog open/close cycles', () => {
    // Arrange
    const { rerender } = render(
      <JsonEditorDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        initialValue="{}"
      />
    )

    // Act & Assert
    rerender(
      <JsonEditorDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        initialValue="{}"
      />
    )
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')

    rerender(
      <JsonEditorDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        initialValue="{}"
      />
    )
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
  }) 

  it('should handle readonly mode correctly', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      initialValue: '{"test": "value"}',
      readonly: true,
    }

    // Act
    render(<JsonEditorDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    expect(jsonEditor).toHaveAttribute('data-readonly', 'true')
    
    const okButton = screen.getByText('OK')
    expect(okButton).toBeDisabled()
  })
}) 