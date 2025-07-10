import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateAccountForm } from '../create-account-form'

// Mock the dependencies
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, type, disabled, className }) => (
    <button data-testid="button" onClick={onClick} data-variant={variant} type={type} disabled={disabled} className={className}>
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

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ id, name, placeholder, required, className }) => (
    <input data-testid="input" id={id} name={name} placeholder={placeholder} required={required} className={className} />
  ))
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ htmlFor, children, className }) => (
    <label data-testid="label" htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ))
}))

vi.mock('@/components/ui/select', () => ({
  Select: vi.fn(({ name, required, children }) => (
    <select data-testid="select" name={name} required={required}>
      {children}
    </select>
  )),
  SelectContent: vi.fn(({ children }) => <div data-testid="select-content">{children}</div>),
  SelectItem: vi.fn(({ value, children }) => <option data-testid="select-item" value={value}>{children}</option>),
  SelectTrigger: vi.fn(({ className, children }) => <div data-testid="select-trigger" className={className}>{children}</div>),
  SelectValue: vi.fn(({ placeholder }) => <div data-testid="select-value" data-placeholder={placeholder}>Select Value</div>)
}))

describe('CreateAccountForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the form with correct content', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Create Account')
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument()
    expect(screen.getByText('Enter account username and role to create a new account')).toBeInTheDocument()
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('select')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-footer')).toBeInTheDocument()
  })

  it('should render username input with correct attributes', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const usernameInput = screen.getByTestId('input')
    expect(usernameInput).toHaveAttribute('id', 'username')
    expect(usernameInput).toHaveAttribute('name', 'username')
    expect(usernameInput).toHaveAttribute('placeholder', 'Enter username')
    expect(usernameInput).toHaveAttribute('required')
  })

  it('should render username label with correct attributes', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const labels = screen.getAllByTestId('label')
    const usernameLabel = labels[0] // First label is for username
    expect(usernameLabel).toHaveAttribute('for', 'username')
    expect(usernameLabel).toHaveTextContent('Username')
  })

  it('should render role select with correct attributes', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const roleSelect = screen.getByTestId('select')
    expect(roleSelect).toHaveAttribute('name', 'role')
    expect(roleSelect).toHaveAttribute('required')
  })

  it('should render role label with correct attributes', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const labels = screen.getAllByTestId('label')
    const roleLabel = labels[1] // Second label is for role
    expect(roleLabel).toHaveAttribute('for', 'role')
    expect(roleLabel).toHaveTextContent('Role')
  })

  it('should render select components correctly', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('select-value')).toBeInTheDocument()
    expect(screen.getByTestId('select-content')).toBeInTheDocument()
  })

  it('should render all role options', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const selectItems = screen.getAllByTestId('select-item')
    expect(selectItems).toHaveLength(3) // admin, developer, readonly
    
    const roleValues = selectItems.map(item => item.getAttribute('value'))
    expect(roleValues).toContain('admin')
    expect(roleValues).toContain('developer')
    expect(roleValues).toContain('readonly')
  })

  it('should render buttons with correct text and states when not creating', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const buttons = screen.getAllByTestId('button')
    expect(buttons).toHaveLength(2)
    
    expect(buttons[0]).toHaveTextContent('Create Account')
    expect(buttons[0]).toHaveAttribute('type', 'submit')
    expect(buttons[0]).not.toBeDisabled()
    
    expect(buttons[1]).toHaveTextContent('Close')
    expect(buttons[1]).toHaveAttribute('type', 'button')
    expect(buttons[1]).toHaveAttribute('data-variant', 'outline')
  })

  it('should render buttons with correct text and states when creating', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={true} onOpenChange={mockOnOpenChange} />)

    // Assert
    const buttons = screen.getAllByTestId('button')
    expect(buttons).toHaveLength(2)
    
    expect(buttons[0]).toHaveTextContent('Creating...')
    expect(buttons[0]).toHaveAttribute('type', 'submit')
    expect(buttons[0]).toBeDisabled()
    
    expect(buttons[1]).toHaveTextContent('Close')
    expect(buttons[1]).toHaveAttribute('type', 'button')
    expect(buttons[1]).toHaveAttribute('data-variant', 'outline')
  })

  it('should call onOpenChange with false when close button is clicked', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should apply correct CSS classes to form elements', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const selectTrigger = screen.getByTestId('select-trigger')
    expect(selectTrigger).toHaveClass('w-full')
  })

  it('should apply correct CSS classes to grid containers', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)

    // Assert
    const gridContainers = screen.getByTestId('input').parentElement?.parentElement?.querySelectorAll('.grid')
    expect(gridContainers).toHaveLength(2)
    
    // Check that both grid containers have the correct classes
    gridContainers?.forEach(container => {
      expect(container).toHaveClass('gap-2', 'pb-4')
    })
  })

  it('should handle form submission correctly', () => {
    // Arrange
    // Act
    render(<CreateAccountForm onSubmit={mockOnSubmit} isCreating={false} onOpenChange={mockOnOpenChange} />)
    const form = screen.getByTestId('input').closest('form')
    
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })
})
