import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  )),
  DialogContent: vi.fn(({ children }) => <div data-testid="dialog-content">{children}</div>),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <h2 data-testid="dialog-title">{children}</h2>),
  DialogDescription: vi.fn(({ children }) => <p data-testid="dialog-description">{children}</p>),
  DialogFooter: vi.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>),
  DialogClose: vi.fn(({ children, asChild }) => (
    <div data-testid="dialog-close" data-as-child={asChild}>
      {children}
    </div>
  )),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ children, htmlFor }) => <label data-testid="label" htmlFor={htmlFor}>{children}</label>),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, type, variant, disabled, onClick }) => (
    <button data-testid="button" type={type} data-variant={variant} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ id, name, placeholder, required }) => (
    <input data-testid="input" id={id} name={name} placeholder={placeholder} required={required} />
  )),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

import { CreateOperatorDialog } from '../create-operator-dialog'

describe('CreateOperatorDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the dialog with create operator form when not created', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Create Operator')
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Enter the name for the new operator')
    expect(screen.getByTestId('label')).toHaveTextContent('Name')
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Create Operator')
    expect(screen.getByRole('button', { name: 'Create Operator' })).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should render success state when operator is created', () => {
    // Arrange
    const createdOperator = { id: 1, name: 'Test Operator', apiKey: 'test-key' }
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
      createdOperator,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Operator Created Successfully')
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Operator has been created successfully')
    expect(screen.getByText('Copy operator data')).toBeInTheDocument()
    expect(screen.getByText('Make sure to save this operator data securely. It won\'t be shown again.')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('should handle form submission with operator name', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)
    const input = screen.getByTestId('input')
    const submitButton = screen.getByRole('button', { name: 'Create Operator' })
    
    fireEvent.change(input, { target: { value: 'New Operator' } })
    fireEvent.click(submitButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('New Operator')
  })

  it('should disable submit button when creating', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: true,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)

    // Assert
    const submitButton = screen.getByText('Creating...')
    expect(submitButton).toBeDisabled()
  })

  it('should copy operator data to clipboard when copy button is clicked', async () => {
    // Arrange
    const createdOperator = { id: 1, name: 'Test Operator', apiKey: 'test-key' }
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
      createdOperator,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)
    const copyButton = screen.getByText('Copy operator data')
    fireEvent.click(copyButton)

    // Assert
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({ id: 1, apiKey: 'test-key' }, null, 2)
      )
    })
  })

  it('should show success toast when copying operator data', async () => {
    // Arrange
    const { toast } = await import('sonner')
    const createdOperator = { id: 1, name: 'Test Operator', apiKey: 'test-key' }
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
      createdOperator,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)
    const copyButton = screen.getByText('Copy operator data')
    fireEvent.click(copyButton)

    // Assert
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Operator data copied to clipboard')
    })
  })

  it('should not render copy button when no operator is created', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)

    // Assert
    expect(screen.queryByText('Copy operator data')).not.toBeInTheDocument()
  })

  it('should handle dialog open state correctly', () => {
    // Arrange
    const props = {
      isOpen: false,
      onOpenChange: mockOnOpenChange,
      onSubmit: mockOnSubmit,
      isCreating: false,
    }

    // Act
    render(<CreateOperatorDialog {...props} />)

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })
})
