import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Accounts } from '../accounts'

// Mock the child components
vi.mock('@/components/accounts/account-table', () => ({
  AccountTable: vi.fn(() => <div data-testid="account-table">Account Table Component</div>)
}))

vi.mock('@/components/accounts/create-account-section', () => ({
  CreateAccountSection: vi.fn(() => <div data-testid="create-account-section">Create Account Section Component</div>)
}))

describe('Accounts', () => {
  it('should render both CreateAccountSection and AccountTable components', () => {
    // Arrange
    // Act
    render(<Accounts />)

    // Assert
    expect(screen.getByTestId('create-account-section')).toBeInTheDocument()
    expect(screen.getByTestId('account-table')).toBeInTheDocument()
    expect(screen.getByText('Create Account Section Component')).toBeInTheDocument()
    expect(screen.getByText('Account Table Component')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<Accounts />)

    // Assert
    const container = screen.getByTestId('create-account-section').parentElement
    expect(container).toHaveClass('flex', 'flex-col')
  })

  it('should render components in correct order', () => {
    // Arrange
    // Act
    render(<Accounts />)

    // Assert
    const container = screen.getByTestId('create-account-section').parentElement
    const children = Array.from(container?.children || [])
    
    expect(children[0]).toHaveAttribute('data-testid', 'create-account-section')
    expect(children[1]).toHaveAttribute('data-testid', 'account-table')
  })
})
