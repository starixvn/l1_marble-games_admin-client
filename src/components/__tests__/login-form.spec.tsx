import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, type, className, onClick }) => (
    <button data-testid="button" type={type} className={className} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/card', () => ({
  Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
  CardContent: vi.fn(({ children }) => <div data-testid="card-content">{children}</div>),
  CardDescription: vi.fn(({ children }) => <p data-testid="card-description">{children}</p>),
  CardHeader: vi.fn(({ children }) => <div data-testid="card-header">{children}</div>),
  CardTitle: vi.fn(({ children }) => <h2 data-testid="card-title">{children}</h2>),
}))

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ name, id, type, required }) => (
    <input data-testid="input" name={name} id={id} type={type} required={required} />
  )),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ children, htmlFor }) => <label data-testid="label" htmlFor={htmlFor}>{children}</label>),
}))

vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

import { LoginForm } from '../login-form'

describe('LoginForm', () => {
  const mockHandleLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the login form with correct structure', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-title')).toBeInTheDocument()
    expect(screen.getByTestId('card-description')).toBeInTheDocument()
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
  })

  it('should render the login form title and description', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    expect(screen.getByText('Login to your account')).toBeInTheDocument()
    expect(screen.getByText('Login with username and password')).toBeInTheDocument()
  })

  it('should render username and password input fields', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const inputs = screen.getAllByTestId('input')
    expect(inputs).toHaveLength(2)
    
    const usernameInput = inputs.find(input => input.getAttribute('name') === 'username')
    const passwordInput = inputs.find(input => input.getAttribute('name') === 'password')
    
    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('should render input labels', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('should apply correct attributes to input fields', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const inputs = screen.getAllByTestId('input')
    const usernameInput = inputs.find(input => input.getAttribute('name') === 'username')
    const passwordInput = inputs.find(input => input.getAttribute('name') === 'password')
    
    expect(usernameInput).toHaveAttribute('id', 'username')
    expect(usernameInput).toHaveAttribute('type', 'username')
    expect(usernameInput).toHaveAttribute('required')
    
    expect(passwordInput).toHaveAttribute('id', 'password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('should render the login button', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should apply correct attributes to login button', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const loginButton = screen.getByTestId('button')
    expect(loginButton).toHaveAttribute('type', 'submit')
    expect(loginButton).toHaveClass('w-full')
  })

  it('should call handleLogin with form data when form is submitted', async () => {
    // Arrange
    mockHandleLogin.mockResolvedValue(undefined)
    
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)
    
    const form = screen.getByTestId('card-content').querySelector('form')
    expect(form).toBeInTheDocument()
    
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith({
        username: '',
        password: '',
      })
    })
  })

  it('should call handleLogin with entered credentials', async () => {
    // Arrange
    mockHandleLogin.mockResolvedValue(undefined)
    
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)
    
    const inputs = screen.getAllByTestId('input')
    const usernameInput = inputs.find(input => input.getAttribute('name') === 'username')
    const passwordInput = inputs.find(input => input.getAttribute('name') === 'password')
    
    if (usernameInput && passwordInput) {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } })
      fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    }
    
    const form = screen.getByTestId('card-content').querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      })
    })
  })

  it('should apply custom className to container', () => {
    // Arrange
    const customClass = 'custom-login-form'
    
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} className={customClass} />)

    // Assert
    const container = screen.getByTestId('card').parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'gap-6', customClass)
  })

  it('should pass through additional props to container', () => {
    // Arrange
    const testId = 'login-form-test'
    
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} data-testid={testId} />)

    // Assert
    const container = screen.getByTestId('card').parentElement
    expect(container).toHaveAttribute('data-testid', testId)
  })

  it('should handle form submission with empty fields', async () => {
    // Arrange
    mockHandleLogin.mockResolvedValue(undefined)
    
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)
    
    const form = screen.getByTestId('card-content').querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith({
        username: '',
        password: '',
      })
    })
  })

  it('should apply correct CSS classes to form container', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const formContainer = screen.getByTestId('card-content').querySelector('.flex.flex-col.gap-6')
    expect(formContainer).toBeInTheDocument()
  })

  it('should apply correct CSS classes to input groups', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const inputGroups = screen.getByTestId('card-content').querySelectorAll('.grid.gap-2')
    expect(inputGroups).toHaveLength(2)
  })

  it('should apply correct CSS classes to password label container', () => {
    // Arrange
    // Act
    render(<LoginForm handleLogin={mockHandleLogin} />)

    // Assert
    const passwordLabelContainer = screen.getByText('Password').closest('.flex.items-center')
    expect(passwordLabelContainer).toBeInTheDocument()
  })
}) 