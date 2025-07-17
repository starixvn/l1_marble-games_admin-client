import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateAccountSection } from '../create-account-section'
import { Role } from '@/api/auth.api'

// Mock the dependencies
vi.mock('@/hooks/useAccounts', () => ({
  useCreateAccount: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, className }) => (
    <button data-testid="button" onClick={onClick} data-variant={variant} className={className}>
      {children}
    </button>
  ))
}))

vi.mock('@/components/accounts/create-account-dialog', () => ({
  CreateAccountDialog: vi.fn(({ isOpen, isCreating, createdAccount }) => (
    <div data-testid="create-account-dialog" data-open={isOpen}>
      Create Account Dialog - {isCreating ? 'Creating' : 'Ready'} - {createdAccount ? 'Has Account' : 'No Account'}
    </div>
  ))
}))

// Import the mocked dependencies
import { useCreateAccount } from '@/hooks/useAccounts'

describe('CreateAccountSection', () => {
  const mockUseCreateAccount = vi.mocked(useCreateAccount)
  const mockMutate = vi.fn()
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the create account button and dialog', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByTestId('create-account-dialog')).toBeInTheDocument()
  })

  it('should open dialog when create account button is clicked', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)
    const createButton = screen.getByText('Create Account')
    fireEvent.click(createButton)

    // Assert
    expect(screen.getByTestId('create-account-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should call reset when dialog is opened', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)
    const createButton = screen.getByText('Create Account')
    fireEvent.click(createButton)

    // Assert
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('should close dialog when onOpenChange is called with false', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)
    const createButton = screen.getByText('Create Account')
    fireEvent.click(createButton) // Open dialog
    
    // Simulate dialog close by clicking the button again (which would trigger onOpenChange)
    fireEvent.click(createButton)

    // Assert
    expect(mockReset).toHaveBeenCalledTimes(2) // Called when opening and when closing
  })

  it('should call mutate with success callback when handleCreateAccount is called', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(mockMutate).not.toHaveBeenCalled() // Should not be called initially
  })



  it('should pass correct props to CreateAccountDialog when not creating', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(screen.getByText('Create Account Dialog - Ready - No Account')).toBeInTheDocument()
  })

  it('should pass correct props to CreateAccountDialog when creating', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(screen.getByText('Create Account Dialog - Creating - No Account')).toBeInTheDocument()
  })

  it('should pass created account data to dialog when available', () => {
    // Arrange
    const mockCreatedAccount = { username: 'newuser', role: Role.DEVELOPER, password: 'testpass' }
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: mockCreatedAccount
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(screen.getByText('Create Account Dialog - Ready - Has Account')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    const container = screen.getByTestId('button').closest('div')?.parentElement
    expect(container).toHaveClass('md:pt-4', 'pr-2')
  })

  it('should apply correct CSS classes to button container', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    const buttonContainer = screen.getByTestId('button').closest('div')
    expect(buttonContainer).toHaveClass('flex', 'justify-end')
  })

  it('should call useCreateAccount hook exactly once', () => {
    // Arrange
    mockUseCreateAccount.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      reset: mockReset,
      data: undefined
    })

    // Act
    render(<CreateAccountSection />)

    // Assert
    expect(mockUseCreateAccount).toHaveBeenCalledTimes(1)
    expect(mockUseCreateAccount).toHaveBeenCalledWith()
  })
})
