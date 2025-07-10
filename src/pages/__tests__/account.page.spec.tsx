import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock the AdminLayout component
vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  )),
}))

// Mock the Accounts component
vi.mock('@/components/accounts/accounts', () => ({
  Accounts: vi.fn(() => <div data-testid="accounts-component">Accounts Component</div>),
}))

import { AccountPage } from '../account.page'

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the account page with AdminLayout', () => {
    // Arrange & Act
    render(<AccountPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render the Accounts component inside AdminLayout', () => {
    // Arrange & Act
    render(<AccountPage />)

    // Assert
    expect(screen.getByTestId('accounts-component')).toBeInTheDocument()
    expect(screen.getByText('Accounts Component')).toBeInTheDocument()
  })

  it('should pass children to AdminLayout correctly', () => {
    // Arrange & Act
    render(<AccountPage />)

    // Assert
    const adminLayout = screen.getByTestId('admin-layout')
    const accountsComponent = screen.getByTestId('accounts-component')
    expect(adminLayout).toContainElement(accountsComponent)
  })

  it('should render the complete page structure', () => {
    // Arrange & Act
    render(<AccountPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
    expect(screen.getByTestId('accounts-component')).toBeInTheDocument()
    expect(screen.getByText('Accounts Component')).toBeInTheDocument()
  })
})
