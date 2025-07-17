import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, type, variant, onClick, disabled }) => (
    <button data-testid="button" type={type} data-variant={variant} onClick={onClick} disabled={disabled}>
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

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

import { OperatorChangePasswordDialog } from '../operator-change-password-dialog'
import { toast } from 'sonner'

describe('OperatorChangePasswordDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockOnGeneratePassword = vi.fn()
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
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Generate New Password')
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Generate a new password for operator Test Operator (operator-123)')
    expect(screen.getByText('Generate Password')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should render generate password button when no password is generated', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    expect(screen.getByText('Generate Password')).toBeInTheDocument()
    expect(screen.queryByText('Copy operator data')).not.toBeInTheDocument()
  })

  it('should render copy button when password is generated', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      generatedPassword: 'new-password-123',
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    expect(screen.getByText('Copy operator data')).toBeInTheDocument()
    expect(screen.getByText('Make sure to save this password securely. It won\'t be shown again.')).toBeInTheDocument()
    expect(screen.queryByText('Generate Password')).not.toBeInTheDocument()
  })

  it('should call onGeneratePassword when generate button is clicked', async () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)
    const generateButton = screen.getByText('Generate Password')
    fireEvent.click(generateButton)

    // Assert
    await waitFor(() => {
      expect(mockOnGeneratePassword).toHaveBeenCalledWith('operator-123')
    })
  })

  it('should disable generate button when generating', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: true,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    const generateButton = screen.getByText('Generating...')
    expect(generateButton).toBeDisabled()
  })

  it('should copy password to clipboard when copy button is clicked', async () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      generatedPassword: 'new-password-123',
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)
    const copyButton = screen.getByText('Copy operator data')
    fireEvent.click(copyButton)

    // Assert
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify('new-password-123', null, 2))
      expect(toast.success).toHaveBeenCalledWith('Operator data copied to clipboard')
    })
  })

  it('should call onOpenChange when close button is clicked', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)
    const closeButton = screen.getByText('Cancel')
    fireEvent.click(closeButton)

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledTimes(1)
  })

  it('should show Done button when password is generated', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      generatedPassword: 'new-password-123',
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('should handle dialog open state correctly', () => {
    // Arrange
    const props = {
      isOpen: false,
      onOpenChange: mockOnOpenChange,
      operator: mockOperator,
      onGeneratePassword: mockOnGeneratePassword,
      isGenerating: false,
    }

    // Act
    render(<OperatorChangePasswordDialog {...props} />)

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })
}) 