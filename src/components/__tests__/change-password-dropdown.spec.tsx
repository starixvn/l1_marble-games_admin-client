import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ChangePassword } from '../change-password-dropdown'

// Mock all dependencies
vi.mock('@/hooks/usePasswordGenerate', () => ({
  usePasswordGenerate: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => (
    <div data-testid="dialog" data-open={open}>
      {open && (
        <>
          {children}
          <button 
            data-testid="dialog-close-button" 
            onClick={() => onOpenChange?.(false)}
          >
            Close Dialog
          </button>
        </>
      )}
    </div>
  ),
  DialogClose: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
    if (asChild) {
      return children
    }
    return <button data-testid="dialog-close">{children}</button>
  },
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-description">{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, type, ...props }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    type?: string;
    [key: string]: unknown;
  }) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-type={type ?? 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

const mockUsePasswordGenerate = vi.mocked(await import('@/hooks/usePasswordGenerate')).usePasswordGenerate
const mockToast = vi.mocked(await import('sonner')).toast

describe('ChangePassword', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePasswordGenerate.mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
      data: undefined,
    })
  })

  describe('Dialog rendering', () => {
    it('should render dialog when open is true', () => {
      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    })

    it('should not render dialog content when open is false', () => {
      render(<ChangePassword {...defaultProps} open={false} />)
      
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
    })

    it('should pass onOpenChange prop to Dialog and call it when dialog is closed', () => {
      const mockOnOpenChange = vi.fn()
      render(<ChangePassword {...defaultProps} onOpenChange={mockOnOpenChange} />)
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      
      // Click the close button in the mock dialog
      const closeButton = screen.getByTestId('dialog-close-button')
      fireEvent.click(closeButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Dialog content structure', () => {
    it('should render correct dialog structure', () => {
      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Reset Password')
      expect(screen.getByTestId('dialog-description')).toHaveTextContent('Generate new password')
      expect(screen.getByTestId('dialog-content')).toHaveAttribute('class', 'sm:max-w-[425px]')
      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument()
    })
  })

  describe('Initial state - Generate Password', () => {
    it('should show generate password button when no password is generated', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: undefined,
      })

      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByText('Generate Password')).toBeInTheDocument()
      expect(screen.queryByText('Copy password')).not.toBeInTheDocument()
    })

    it('should call mutate when generate password button is clicked', () => {
      const mockMutate = vi.fn()
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: mockMutate,
        data: undefined,
      })

      render(<ChangePassword {...defaultProps} />)
      
      const generateButton = screen.getByText('Generate Password')
      fireEvent.click(generateButton)
      
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })

    it('should show loading state when generating password', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: true,
        mutate: vi.fn(),
        data: undefined,
      })

      render(<ChangePassword {...defaultProps} />)
      
      const generateButton = screen.getByText('Generating...')
      expect(generateButton).toBeInTheDocument()
      expect(generateButton).toBeDisabled()
    })
  })

  describe('Password generated state', () => {
    it('should show copy password button when password is generated', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByText('Copy password')).toBeInTheDocument()
      expect(screen.queryByText('Generate Password')).not.toBeInTheDocument()
    })

    it('should show warning message when password is generated', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByText(/Make sure to save this password securely/)).toBeInTheDocument()
      expect(screen.getByText(/It won't be shown again/)).toBeInTheDocument()
    })

    it('should copy password to clipboard when copy button is clicked', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator.clipboard, { writeText: mockWriteText })

      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      const copyButton = screen.getByText('Copy password')
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('test-password-123')
        expect(mockToast.success).toHaveBeenCalledWith('Password copied to clipboard')
      })
    })

    it('should show "Done" button instead of "Cancel" when password is generated', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('Button variants and types', () => {
    it('should render generate button with correct props', () => {
      render(<ChangePassword {...defaultProps} />)
      
      const generateButton = screen.getByText('Generate Password')
      expect(generateButton).toHaveAttribute('data-type', 'button')
      expect(generateButton).not.toBeDisabled()
    })

    it('should render copy button with correct props', () => {
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      const copyButton = screen.getByText('Copy password')
      expect(copyButton).toHaveAttribute('data-type', 'button')
      expect(copyButton).toHaveAttribute('data-variant', 'outline')
    })

    it('should render close button with correct props', () => {
      render(<ChangePassword {...defaultProps} />)
      
      const closeButton = screen.getByText('Cancel')
      expect(closeButton).toHaveAttribute('data-variant', 'outline')
    })
  })

  describe('Error handling', () => {
    it('should handle clipboard write error gracefully', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard write failed'))
      Object.assign(navigator.clipboard, { writeText: mockWriteText })

      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'test-password-123' },
      })

      render(<ChangePassword {...defaultProps} />)
      
      const copyButton = screen.getByText('Copy password')
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('test-password-123')
      })
    })
  })

  describe('Component integration', () => {
    it('should transition from generate to copy state when password is generated', () => {
      const { rerender } = render(<ChangePassword {...defaultProps} />)
      
      // Initial state
      expect(screen.getByText('Generate Password')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      
      // After password generation
      mockUsePasswordGenerate.mockReturnValue({
        isPending: false,
        mutate: vi.fn(),
        data: { username: 'testuser', password: 'new-password' },
      })
      
      rerender(<ChangePassword {...defaultProps} />)
      
      expect(screen.getByText('Copy password')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
  })
})
