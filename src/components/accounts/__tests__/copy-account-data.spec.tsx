import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CopyAccountData } from '../copy-account-data'
import { type Account, Role } from '@/api/auth.api'

// Mock the dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn()
  }
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, type, className }) => (
    <button data-testid="button" onClick={onClick} data-variant={variant} type={type} className={className}>
      {children}
    </button>
  ))
}))

vi.mock('@/components/ui/dialog', () => ({
  DialogDescription: vi.fn(({ children }) => <div data-testid="dialog-description">{children}</div>),
  DialogFooter: vi.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <div data-testid="dialog-title">{children}</div>)
}))

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

// Import the mocked dependencies
import { toast } from 'sonner'

describe('CopyAccountData', () => {
  const mockOnOpenChange = vi.fn()
  const mockAccount: Account = {
    username: 'testuser',
    role: Role.ADMIN
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component with correct content', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)

    // Assert
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByText('Account created successfully')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument()
    expect(screen.getByText('Account data copied to clipboard. Use it to login.')).toBeInTheDocument()
    expect(screen.getByText('Copy account data')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('should display warning message about saving data securely', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)

    // Assert
    expect(screen.getByText('Make sure to save this operator data securely. It won\'t be shown again.')).toBeInTheDocument()
  })

  it('should copy account data to clipboard when copy button is clicked', async () => {
    // Arrange
    const mockWriteText = vi.mocked(navigator.clipboard.writeText)
    mockWriteText.mockResolvedValue(undefined)
    
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)
    const copyButton = screen.getByText('Copy account data')
    fireEvent.click(copyButton)

    // Assert
    expect(mockWriteText).toHaveBeenCalledWith(JSON.stringify(mockAccount, null, 2))
    expect(toast.success).toHaveBeenCalledWith('Account data copied to clipboard')
  })

  it('should call onOpenChange with false when close button is clicked', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should apply correct CSS classes to container elements', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)

    // Assert
    const gridContainer = screen.getByText('Copy account data').closest('div')?.parentElement
    expect(gridContainer).toHaveClass('grid', 'gap-3', 'my-4')
    
    const buttonContainer = screen.getByText('Copy account data').closest('div')
    expect(buttonContainer).toHaveClass('flex', 'gap-2', 'justify-center')
  })

  it('should apply correct styling to warning text', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)

    // Assert
    const warningText = screen.getByText('Make sure to save this operator data securely. It won\'t be shown again.')
    expect(warningText).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('should render buttons with correct variants', () => {
    // Arrange
    // Act
    render(<CopyAccountData account={mockAccount} onOpenChange={mockOnOpenChange} />)

    // Assert
    const buttons = screen.getAllByTestId('button')
    expect(buttons).toHaveLength(2)
    
    // Copy button should have outline variant
    expect(buttons[0]).toHaveAttribute('data-variant', 'outline')
    // Close button should have outline variant
    expect(buttons[1]).toHaveAttribute('data-variant', 'outline')
  })
})
