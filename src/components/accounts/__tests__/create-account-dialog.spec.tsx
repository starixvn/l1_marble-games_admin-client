import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CreateAccountDialog } from '../create-account-dialog'
import { type Account, Role } from '@/api/auth.api'

// Mock the dependencies
vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open} onClick={() => onOpenChange?.(false)}>
      {children}
    </div>
  )),
  DialogContent: vi.fn(({ children }) => <div data-testid="dialog-content">{children}</div>)
}))

vi.mock('@/components/accounts/copy-account-data', () => ({
  CopyAccountData: vi.fn(({ account, onOpenChange }) => (
    <div data-testid="copy-account-data" onClick={() => onOpenChange(false)}>
      Copy Account Data Component - {account.username}
    </div>
  ))
}))

vi.mock('@/components/accounts/create-account-form', () => ({
  CreateAccountForm: vi.fn(({ onSubmit, isCreating }) => (
    <div data-testid="create-account-form" onClick={() => onSubmit({ username: 'test', role: Role.ADMIN })}>
      Create Account Form Component - {isCreating ? 'Creating' : 'Ready'}
    </div>
  ))
}))

describe('CreateAccountDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockOnSubmit = vi.fn()
  const mockCreatedAccount: Account = {
    username: 'testuser',
    role: Role.ADMIN
  }

  it('should render CopyAccountData when createdAccount is provided', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
        createdAccount={mockCreatedAccount}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('copy-account-data')).toBeInTheDocument()
    expect(screen.getByText('Copy Account Data Component - testuser')).toBeInTheDocument()
    expect(screen.queryByTestId('create-account-form')).not.toBeInTheDocument()
  })

  it('should render CreateAccountForm when createdAccount is not provided', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('create-account-form')).toBeInTheDocument()
    expect(screen.getByText('Create Account Form Component - Ready')).toBeInTheDocument()
    expect(screen.queryByTestId('copy-account-data')).not.toBeInTheDocument()
  })

  it('should pass correct props to CreateAccountForm', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={true}
      />
    )

    // Assert
    expect(screen.getByText('Create Account Form Component - Creating')).toBeInTheDocument()
  })

  it('should pass correct props to CopyAccountData', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
        createdAccount={mockCreatedAccount}
      />
    )

    // Assert
    expect(screen.getByText('Copy Account Data Component - testuser')).toBeInTheDocument()
  })

  it('should pass isOpen and onOpenChange to Dialog', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
      />
    )

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'true')
  })

  it('should handle dialog open state correctly', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
      />
    )

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('should render dialog content wrapper', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('should handle undefined createdAccount gracefully', () => {
    // Arrange
    // Act
    render(
      <CreateAccountDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        isCreating={false}
        createdAccount={undefined}
      />
    )

    // Assert
    expect(screen.getByTestId('create-account-form')).toBeInTheDocument()
    expect(screen.queryByTestId('copy-account-data')).not.toBeInTheDocument()
  })
})
