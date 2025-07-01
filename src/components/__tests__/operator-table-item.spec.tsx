import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@tabler/icons-react', () => ({
  IconDotsVertical: vi.fn(() => <div data-testid="dots-icon" />),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: vi.fn(({ children }) => <div data-testid="dropdown-menu">{children}</div>),
  DropdownMenuContent: vi.fn(({ children, align, className }) => (
    <div data-testid="dropdown-menu-content" data-align={align} className={className}>
      {children}
    </div>
  )),
  DropdownMenuItem: vi.fn(({ children, onClick }) => (
    <button data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </button>
  )),
  DropdownMenuTrigger: vi.fn(({ children, asChild }) => (
    <div data-testid="dropdown-menu-trigger" data-as-child={asChild}>
      {children}
    </div>
  )),
}))

vi.mock('@/components/ui/table', () => ({
  TableCell: vi.fn(({ children, className }) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  )),
  TableRow: vi.fn(({ children, key }) => (
    <tr data-testid="table-row" data-key={key}>
      {children}
    </tr>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, variant, className, size, onClick }) => (
    <button data-testid="button" data-variant={variant} className={className} data-size={size} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(() => ({
    updateOperatorNameMutation: {
      mutate: vi.fn(),
      isPending: false,
      data: null,
      reset: vi.fn(),
      error: null,
      variables: undefined,
      isError: false as const,
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      mutateAsync: vi.fn(),
      context: undefined,
      status: 'idle' as const,
      submittedAt: 0,
    },
    generatePasswordMutation: {
      mutate: vi.fn(),
      isPending: false,
      data: null,
      reset: vi.fn(),
      error: null,
      variables: undefined,
      isError: false as const,
      isIdle: true,
      isSuccess: false,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      mutateAsync: vi.fn(),
      context: undefined,
      status: 'idle' as const,
      submittedAt: 0,
    },
  })),
}))

vi.mock('@/components/operator-rename-dialog', () => ({
  OperatorRenameDialog: vi.fn(({ isOpen, onOpenChange, operator, onSubmit }) => (
    <div data-testid="operator-rename-dialog" data-open={isOpen}>
      <div data-testid="rename-dialog-props">
        {JSON.stringify({ isOpen, operator })}
      </div>
      <button data-testid="mock-rename-submit" onClick={() => onSubmit('operator-123', 'New Name')}>
        Mock Rename Submit
      </button>
      <button data-testid="mock-rename-close" onClick={() => onOpenChange(false)}>
        Mock Rename Close
      </button>
    </div>
  )),
}))

vi.mock('@/components/operator-change-password-dialog', () => ({
  OperatorChangePasswordDialog: vi.fn(({ isOpen, onOpenChange, operator, onGeneratePassword, generatedPassword, isGenerating }) => (
    <div data-testid="operator-change-password-dialog" data-open={isOpen}>
      <div data-testid="password-dialog-props">
        {JSON.stringify({ isOpen, operator, generatedPassword, isGenerating })}
      </div>
      <button data-testid="mock-password-submit" onClick={() => onGeneratePassword('operator-123')}>
        Mock Password Submit
      </button>
      <button data-testid="mock-password-close" onClick={() => onOpenChange(false)}>
        Mock Password Close
      </button>
    </div>
  )),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { OperatorTableItem } from '../operator-table-item'
import { useOperator } from '@/hooks/useOperator'
import { toast } from 'sonner'

describe('OperatorTableItem', () => {
  const mockOperator = {
    id: 'operator-123',
    name: 'Test Operator',
  }

  const mockUpdateOperatorNameMutation = {
    mutate: vi.fn(),
    isPending: false as const,
    data: undefined,
    reset: vi.fn(),
    error: null,
    variables: undefined,
    isError: false as const,
    isIdle: true as const,
    isSuccess: false as const,
    isPaused: false,
    failureCount: 0,
    failureReason: null,
    mutateAsync: vi.fn(),
    context: undefined,
    status: 'idle' as const,
    submittedAt: 0,
  }

  const mockGeneratePasswordMutation = {
    mutate: vi.fn(),
    isPending: false as const,
    data: undefined,
    reset: vi.fn(),
    error: null,
    variables: undefined,
    isError: false as const,
    isIdle: true as const,
    isSuccess: false as const,
    isPaused: false,
    failureCount: 0,
    failureReason: null,
    mutateAsync: vi.fn(),
    context: undefined,
    status: 'idle' as const,
    submittedAt: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useOperator).mockReturnValue({
      operatorsQuery: {} as unknown as ReturnType<typeof useOperator>['operatorsQuery'],
      createOperatorMutation: {} as unknown as ReturnType<typeof useOperator>['createOperatorMutation'],
      updateOperatorNameMutation: mockUpdateOperatorNameMutation,
      generatePasswordMutation: mockGeneratePasswordMutation,
    })
  })

  it('should render the operator table item with correct structure', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getAllByTestId('table-cell')).toHaveLength(3)
    expect(screen.getByText('operator-123')).toBeInTheDocument()
    expect(screen.getByText('Test Operator')).toBeInTheDocument()
  })

  it('should render operator ID and name in table cells', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveTextContent('operator-123')
    expect(cells[1]).toHaveTextContent('Test Operator')
  })

  it('should render dropdown menu with correct structure', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-menu-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument()
  })

  it('should render dropdown menu items', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    const menuItems = screen.getAllByTestId('dropdown-menu-item')
    expect(menuItems).toHaveLength(2)
    expect(menuItems[0]).toHaveTextContent('Rename')
    expect(menuItems[1]).toHaveTextContent('Get new password')
  })

  it('should apply correct CSS classes to table cells', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveClass('px-6')
    expect(cells[1]).toHaveClass('px-6')
    expect(cells[2]).toHaveClass('flex', 'justify-end', 'px-6')
  })

  it('should apply correct CSS classes to dropdown menu content', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    const dropdownContent = screen.getByTestId('dropdown-menu-content')
    expect(dropdownContent).toHaveClass('w-48')
    expect(dropdownContent).toHaveAttribute('data-align', 'end')
  })

  it('should open rename dialog when rename menu item is clicked', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const renameMenuItem = screen.getByText('Rename')
    fireEvent.click(renameMenuItem)

    // Assert
    expect(screen.getByTestId('operator-rename-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should open password dialog when get new password menu item is clicked', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const passwordMenuItem = screen.getByText('Get new password')
    fireEvent.click(passwordMenuItem)

    // Assert
    expect(screen.getByTestId('operator-change-password-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should reset generate password mutation when opening password dialog', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const passwordMenuItem = screen.getByText('Get new password')
    fireEvent.click(passwordMenuItem)

    // Assert
    expect(mockGeneratePasswordMutation.reset).toHaveBeenCalled()
  })

  it('should call updateOperatorNameMutation when rename is submitted', async () => {
    // Arrange
    mockUpdateOperatorNameMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const renameMenuItem = screen.getByText('Rename')
    fireEvent.click(renameMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-rename-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    expect(mockUpdateOperatorNameMutation.mutate).toHaveBeenCalledWith(
      { operatorId: 'operator-123', name: 'New Name' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    )
  })

  it('should show success toast when rename succeeds', async () => {
    // Arrange
    mockUpdateOperatorNameMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const renameMenuItem = screen.getByText('Rename')
    fireEvent.click(renameMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-rename-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Operator name updated successfully')
    })
  })

  it('should show error toast when rename fails', async () => {
    // Arrange
    const mockError = new Error('Update failed')
    mockUpdateOperatorNameMutation.mutate.mockImplementation((_, options) => {
      options.onError(mockError)
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const renameMenuItem = screen.getByText('Rename')
    fireEvent.click(renameMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-rename-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed')
    })
  })

  it('should call generatePasswordMutation when password generation is submitted', async () => {
    // Arrange
    mockGeneratePasswordMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const passwordMenuItem = screen.getByText('Get new password')
    fireEvent.click(passwordMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-password-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    expect(mockGeneratePasswordMutation.mutate).toHaveBeenCalledWith(
      { operatorId: 'operator-123' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    )
  })

  it('should show success toast when password generation succeeds', async () => {
    // Arrange
    mockGeneratePasswordMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const passwordMenuItem = screen.getByText('Get new password')
    fireEvent.click(passwordMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-password-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password generated successfully')
    })
  })

  it('should close rename dialog after successful submission', async () => {
    // Arrange
    mockUpdateOperatorNameMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<OperatorTableItem operator={mockOperator} />)
    const renameMenuItem = screen.getByText('Rename')
    fireEvent.click(renameMenuItem)
    
    const mockSubmitButton = screen.getByTestId('mock-rename-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('operator-rename-dialog')).toHaveAttribute('data-open', 'false')
    })
  })

  it('should render screen reader text for dropdown button', () => {
    // Arrange
    // Act
    render(<OperatorTableItem operator={mockOperator} />)

    // Assert
    expect(screen.getByText('Open menu')).toBeInTheDocument()
    expect(screen.getByText('Open menu')).toHaveClass('sr-only')
  })
}) 