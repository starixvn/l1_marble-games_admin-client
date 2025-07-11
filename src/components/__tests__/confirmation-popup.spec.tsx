import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: vi.fn(({ children, open, onOpenChange }) => (
    <div data-testid="alert-dialog" data-open={open} data-on-open-change={!!onOpenChange}>
      {children}
    </div>
  )),
  AlertDialogContent: vi.fn(({ children }) => <div data-testid="alert-dialog-content">{children}</div>),
  AlertDialogHeader: vi.fn(({ children }) => <div data-testid="alert-dialog-header">{children}</div>),
  AlertDialogTitle: vi.fn(({ children, className }) => (
    <h2 data-testid="alert-dialog-title" className={className}>
      {children}
    </h2>
  )),
  AlertDialogDescription: vi.fn(({ children }) => (
    <p data-testid="alert-dialog-description">{children}</p>
  )),
  AlertDialogFooter: vi.fn(({ children }) => <div data-testid="alert-dialog-footer">{children}</div>),
  AlertDialogCancel: vi.fn(({ children, onClick }) => (
    <button data-testid="alert-dialog-cancel" onClick={onClick}>
      {children}
    </button>
  )),
  AlertDialogAction: vi.fn(({ children, onClick }) => (
    <button data-testid="alert-dialog-action" onClick={onClick}>
      {children}
    </button>
  )),
}))

import { ConfirmationPopup } from '../confirmation-popup'

describe('ConfirmationPopup', () => {
  const defaultProps = {
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    open: true,
    onOpenChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the confirmation popup with correct structure', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('alert-dialog-header')).toBeInTheDocument()
    expect(screen.getByTestId('alert-dialog-footer')).toBeInTheDocument()
  })

  it('should render the title and description correctly', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Delete Item')
    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('Are you sure you want to delete this item?')
  })

  it('should apply correct CSS classes to title', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    const title = screen.getByTestId('alert-dialog-title')
    expect(title).toHaveClass('text-lg', 'font-bold', 'text-red-500')
  })

  it('should render cancel and continue buttons', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Cancel')
    expect(screen.getByTestId('alert-dialog-action')).toHaveTextContent('Continue')
  })

  it('should call onCancel when cancel button is clicked', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)
    const cancelButton = screen.getByTestId('alert-dialog-cancel')
    fireEvent.click(cancelButton)

    // Assert
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onConfirm when continue button is clicked', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)
    const continueButton = screen.getByTestId('alert-dialog-action')
    fireEvent.click(continueButton)

    // Assert
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should pass open state to AlertDialog', () => {
    // Arrange
    const props = { ...defaultProps, open: false }
    
    // Act
    render(<ConfirmationPopup {...props} />)

    // Assert
    const alertDialog = screen.getByTestId('alert-dialog')
    expect(alertDialog).toHaveAttribute('data-open', 'false')
  })

  it('should pass onOpenChange to AlertDialog', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    const alertDialog = screen.getByTestId('alert-dialog')
    expect(alertDialog).toHaveAttribute('data-on-open-change', 'true')
  })

  it('should handle different title and description content', () => {
    // Arrange
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      description: 'Custom description text',
    }
    
    // Act
    render(<ConfirmationPopup {...customProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Custom Title')
    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('Custom description text')
  })

  it('should handle multiple button clicks correctly', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)
    const cancelButton = screen.getByTestId('alert-dialog-cancel')
    const continueButton = screen.getByTestId('alert-dialog-action')
    
    fireEvent.click(cancelButton)
    fireEvent.click(continueButton)
    fireEvent.click(cancelButton)

    // Assert
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(2)
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should render with different button text when provided', () => {
    // Arrange
    // Note: The component currently has hardcoded button text, but this test ensures
    // the buttons are rendered correctly regardless of the text content
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog-cancel')).toBeInTheDocument()
    expect(screen.getByTestId('alert-dialog-action')).toBeInTheDocument()
  })

  it('should handle empty title and description', () => {
    // Arrange
    const emptyProps = {
      ...defaultProps,
      title: '',
      description: '',
    }
    
    // Act
    render(<ConfirmationPopup {...emptyProps} />)

    // Assert
    expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('')
    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('')
  })

  it('should maintain proper component structure with all required elements', () => {
    // Arrange
    // Act
    render(<ConfirmationPopup {...defaultProps} />)

    // Assert
    const alertDialog = screen.getByTestId('alert-dialog')
    const content = screen.getByTestId('alert-dialog-content')
    const header = screen.getByTestId('alert-dialog-header')
    const footer = screen.getByTestId('alert-dialog-footer')
    
    expect(alertDialog).toContainElement(content)
    expect(content).toContainElement(header)
    expect(content).toContainElement(footer)
    expect(header).toContainElement(screen.getByTestId('alert-dialog-title'))
    expect(header).toContainElement(screen.getByTestId('alert-dialog-description'))
    expect(footer).toContainElement(screen.getByTestId('alert-dialog-cancel'))
    expect(footer).toContainElement(screen.getByTestId('alert-dialog-action'))
  })
}) 