import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/create-operator-dialog', () => ({
  CreateOperatorDialog: vi.fn(({ isOpen, onOpenChange, onSubmit, isCreating, createdOperator }) => (
    <div data-testid="create-operator-dialog" data-open={isOpen}>
      <div data-testid="dialog-props">
        {JSON.stringify({ isOpen, isCreating, createdOperator })}
      </div>
      <button data-testid="mock-submit" onClick={() => onSubmit('Test Operator')}>
        Mock Submit
      </button>
      <button data-testid="mock-close" onClick={() => onOpenChange(false)}>
        Mock Close
      </button>
    </div>
  )),
}))

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(() => ({
    createOperatorMutation: {
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

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { CreateOperatorSection } from '../create-operator-section'
import { useOperator } from '@/hooks/useOperator'
import { toast } from 'sonner'

describe('CreateOperatorSection', () => {
  const mockCreateOperatorMutation = {
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
      createOperatorMutation: mockCreateOperatorMutation,
      updateOperatorNameMutation: {} as unknown as ReturnType<typeof useOperator>['updateOperatorNameMutation'],
      generatePasswordMutation: {} as unknown as ReturnType<typeof useOperator>['generatePasswordMutation'],
    })
  })

  it('should render the create operator button', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)

    // Assert
    expect(screen.getByText('Create Operator')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should open dialog when create operator button is clicked', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)

    // Assert
    expect(screen.getByTestId('create-operator-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should call createOperatorMutation.mutate when form is submitted', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)
    
    const mockSubmitButton = screen.getByTestId('mock-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    expect(mockCreateOperatorMutation.mutate).toHaveBeenCalledWith(
      { name: 'Test Operator' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    )
  })

  it('should show success toast when operator creation succeeds', async () => {
    // Arrange
    mockCreateOperatorMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)
    
    const mockSubmitButton = screen.getByTestId('mock-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Operator created successfully')
    })
  })

  it('should show error toast when operator creation fails', async () => {
    // Arrange
    mockCreateOperatorMutation.mutate.mockImplementation((_, options) => {
      options.onError()
    })

    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)
    
    const mockSubmitButton = screen.getByTestId('mock-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create operator')
    })
  })

  it('should reset mutation when dialog is opened', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)

    // Assert
    expect(mockCreateOperatorMutation.reset).toHaveBeenCalled()
  })

  it('should close dialog when close button is clicked', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)
    const createButton = screen.getByText('Create Operator')
    fireEvent.click(createButton)
    
    const mockCloseButton = screen.getByTestId('mock-close')
    fireEvent.click(mockCloseButton)

    // Assert
    expect(screen.getByTestId('create-operator-dialog')).toHaveAttribute('data-open', 'false')
  })

  it('should pass correct props to CreateOperatorDialog', () => {
    // Arrange
    mockCreateOperatorMutation.isPending = true as unknown as typeof mockCreateOperatorMutation.isPending
    mockCreateOperatorMutation.data = { data: { id: 1, name: 'Test' } } as unknown as typeof mockCreateOperatorMutation.data

    // Act
    render(<CreateOperatorSection />)

    // Assert
    const dialogProps = screen.getByTestId('dialog-props')
    expect(dialogProps).toHaveTextContent('"isOpen":false')
    expect(dialogProps).toHaveTextContent('"isCreating":true')
    expect(dialogProps).toHaveTextContent('"createdOperator":{"id":1,"name":"Test"}')
  })

  it('should render with correct CSS classes', () => {
    // Arrange
    // Act
    render(<CreateOperatorSection />)

    // Assert
    const container = screen.getByText('Create Operator').closest('div')?.parentElement?.parentElement
    expect(container).toHaveClass('@container/main')
  })
})
