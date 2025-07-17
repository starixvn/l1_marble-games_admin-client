import { render, screen, fireEvent } from '@testing-library/react'

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
  Label: vi.fn(({ children }) => <label data-testid="label">{children}</label>),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, type, variant, onClick }) => (
    <button data-testid="button" type={type} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ id, name, type, value }) => (
    <input data-testid="input" id={id} name={name} type={type} value={value} aria-label={name} />
  )),
}))

import { OperatorRenameDialog } from '../operator-rename-dialog'

describe('OperatorRenameDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockOperator = {
    id: 'operator-123',
    name: 'Test Operator',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the dialog with correct structure', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Rename Operator')
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Change the name for operator operator-123')
    expect(screen.getByTestId('label')).toHaveTextContent('Name')
    expect(screen.getByText('Save changes')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should render dialog with correct open state', () => {
    // Arrange
    const props = {
      isOpen: false,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('should render hidden input with operator ID', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const hiddenInput = screen.getByDisplayValue('operator-123')
    expect(hiddenInput).toHaveAttribute('type', 'hidden')
    expect(hiddenInput).toHaveAttribute('name', 'operatorId')
    expect(hiddenInput).toHaveAttribute('value', 'operator-123')
  })

  it('should render name input field', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const inputs = screen.getAllByTestId('input')
    const nameInput = inputs.find(input => input.getAttribute('name') === 'name')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('id', 'name')
  })

  it('should call onSubmit with correct parameters when form is submitted', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)
    const submitButton = screen.getByText('Save changes')
    
    fireEvent.click(submitButton)

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith('operator-123', '')
  })

  it('should apply correct styling to form elements', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const formContainer = screen.getByTestId('dialog-content').querySelector('.grid.gap-4')
    expect(formContainer).toBeInTheDocument()
  })

  it('should render cancel button with correct props', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton).toHaveAttribute('data-variant', 'outline')
  })

  it('should render submit button with correct props', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onSubmit: mockOnSubmit,
    }

    // Act
    render(<OperatorRenameDialog {...props} />)

    // Assert
    const submitButton = screen.getByText('Save changes')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
}) 