import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/hooks/useGameConfigSchema', () => ({
  useGameConfigSchema: vi.fn(() => ({
    gameConfigSchemaListQuery: {
      isLoading: false,
      data: { data: [] },
      isError: false,
    },
    currentSchemaId: null,
    setCurrentSchemaId: vi.fn(),
    gameConfigSchemaGetQuery: {
      isLoading: false,
      data: { data: { schema: {} } },
      isError: false,
    },
  })),
}))

vi.mock('@/hooks/useGameConfig', () => ({
  useGameConfig: vi.fn(() => ({
    gameConfigQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigQuery'],
    gameConfigUpsertMutation: {
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
    currentGameId: null,
    setCurrentGameId: vi.fn(),
    gameConfigWithIdQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigWithIdQuery'],
  })),
}))

vi.mock('@/components/game-config-schema-combobox', () => ({
  GameConfigSchemaCombobox: vi.fn(({ currentSchemaId, setCurrentSchemaId, data }) => (
    <div data-testid="game-config-schema-combobox" data-current-schema-id={currentSchemaId}>
      <div data-testid="combobox-props">
        {JSON.stringify({ currentSchemaId, data })}
      </div>
      <button data-testid="mock-set-schema" onClick={() => setCurrentSchemaId('schema-123')}>
        Set Schema
      </button>
    </div>
  )),
}))

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ id, className, type, value, onChange }) => (
    <input data-testid="input" id={id} className={className} type={type} value={value} onChange={onChange} />
  )),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ children, htmlFor, className }) => (
    <label data-testid="label" htmlFor={htmlFor} className={className}>
      {children}
    </label>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, variant, size, onClick }) => (
    <button data-testid="button" data-variant={variant} data-size={size} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/json-editor-dialog', () => ({
  JsonEditorDialog: vi.fn(({ isOpen, onOpenChange, initialValue, onSubmit, title, description, isLoading, isError }) => (
    <div data-testid="json-editor-dialog" data-open={isOpen}>
      <div data-testid="dialog-props">
        {JSON.stringify({ isOpen, initialValue, title, description, isLoading, isError })}
      </div>
      <button data-testid="mock-json-submit" onClick={() => onSubmit('{"test": "value"}')}>
        Mock JSON Submit
      </button>
      <button data-testid="mock-json-close" onClick={() => onOpenChange(false)}>
        Mock JSON Close
      </button>
    </div>
  )),
}))

vi.mock('@rjsf/shadcn', () => ({
  default: vi.fn(({ formData, onChange, onSubmit, schema, liveValidate }) => (
    <form data-testid="rjsf-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div data-testid="form-props">
        {JSON.stringify({ formData, schema, liveValidate })}
      </div>
      <button data-testid="form-submit" type="submit">
        Submit Form
      </button>
      <button data-testid="form-change" onClick={() => onChange({ formData: { test: 'new value' } })}>
        Change Form
      </button>
    </form>
  )),
}))

vi.mock('lucide-react', () => ({
  CodeXml: vi.fn(({ className, strokeWidth, style }) => (
    <div data-testid="code-xml-icon" className={className} data-stroke-width={strokeWidth} style={style} />
  )),
}))

vi.mock('@/lib/validator', () => ({
  validatorWithDataSupport: vi.fn(),
}))

vi.mock('@/shared/const', () => ({
  DEFAULT_SCHEMA: {},
}))

vi.mock('json-merge-patch', () => ({
  apply: vi.fn((target, patch) => ({ ...target, ...patch })),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import NewGameForm from '../new-game-form'
import { useGameConfigSchema } from '@/hooks/useGameConfigSchema'
import { useGameConfig } from '@/hooks/useGameConfig'
import { toast } from 'sonner'

describe('NewGameForm', () => {
  const mockGameConfigUpsertMutation = {
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

  const mockSetCurrentSchemaId = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: undefined as unknown as string | null,
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })
    vi.mocked(useGameConfig).mockReturnValue({
      gameConfigQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigQuery'],
      gameConfigUpsertMutation: mockGameConfigUpsertMutation,
      currentGameId: null,
      setCurrentGameId: vi.fn(),
      gameConfigWithIdQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigWithIdQuery'],
    })
  })

  it('should render the new game form with correct structure', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('New Game')).toBeInTheDocument()
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('game-config-schema-combobox')).toBeInTheDocument()
  })

  it('should render the heading with correct styling', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    const heading = screen.getByText('New Game')
    expect(heading).toHaveClass('scroll-m-20', 'text-2xl', 'font-extrabold', 'tracking-tight', 'mb-4')
  })

  it('should render the game ID input with correct attributes', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('id', 'newGameId')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveClass('mb-4', 'w-[200px]')
  })

  it('should render the game ID label with correct attributes', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    const label = screen.getByText('Game ID').closest('label')
    expect(label).toHaveClass('mb-2')
  })

  it('should render the game config schema combobox', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByTestId('game-config-schema-combobox')).toBeInTheDocument()
  })

  it('should render the JSON editor button', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('code-xml-icon')).toBeInTheDocument()
  })

  it('should apply correct styling to JSON editor button', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
    expect(button).toHaveAttribute('data-size', 'icon')
  })

  it('should apply correct styling to code XML icon', () => {
    // Arrange
    // Act
    render(<NewGameForm />)

    // Assert
    const icon = screen.getByTestId('code-xml-icon')
    expect(icon).toHaveClass('h-4', 'w-4', 'text-blue-500', 'drop-shadow-lg')
    expect(icon).toHaveAttribute('data-stroke-width', '3')
  })

  it('should open JSON editor dialog when button is clicked', () => {
    // Arrange
    // Act
    render(<NewGameForm />)
    const jsonButton = screen.getByTestId('button')
    fireEvent.click(jsonButton)

    // Assert
    expect(screen.getByTestId('json-editor-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should handle game ID input change', () => {
    // Arrange
    // Act
    render(<NewGameForm />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '123' } })

    // Assert
    expect(input).toHaveValue(123)
  })

  it('should handle JSON editor submission', () => {
    // Arrange
    // Act
    render(<NewGameForm />)
    const jsonButton = screen.getByTestId('button')
    fireEvent.click(jsonButton)
    
    const mockSubmitButton = screen.getByTestId('mock-json-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    expect(screen.getByTestId('json-editor-dialog')).toBeInTheDocument()
  })

  it('should render form when schema is selected', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByTestId('rjsf-form')).toBeInTheDocument()
  })

  it('should not render form when no schema is selected', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: undefined,
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    } as unknown as ReturnType<typeof useGameConfigSchema>)

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.queryByTestId('rjsf-form')).not.toBeInTheDocument()
  })

  it('should show loading state when schema list is loading', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: null,
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show loading state when schema get query is loading', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show error state when schema get query has error', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: undefined,
        isError: true,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should show no schema found when schema data is empty', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: null } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    expect(screen.getByText('No schema found')).toBeInTheDocument()
  })

  it('should call gameConfigUpsertMutation when form is submitted with valid data', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '123' } })
    
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    await waitFor(() => {
      expect(mockGameConfigUpsertMutation.mutate).toHaveBeenCalledWith(
        {
          query: {
            gameId: 123,
            schemaId: 'schema-123',
          },
          request: {},
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      )
    })
  })

  it('should show success toast when mutation succeeds', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '123' } })
    
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Game config created')
    })
  })

  it('should show error toast when mutation fails', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onError()
    })

    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)
    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: '123' } })
    
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create game config')
    })
  })

  it('should not submit when game ID or schema ID is missing', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: null,
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)
    
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    expect(mockGameConfigUpsertMutation.mutate).not.toHaveBeenCalled()
  })

  it('should apply correct CSS classes to form container', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { data: [{ id: 'schema-1', name: 'Schema 1' }] } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery']['data'],
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
    })

    // Act
    render(<NewGameForm />)

    // Assert
    const formContainer = screen.getByTestId('rjsf-form').closest('div')
    expect(formContainer).toHaveClass('[&_form]:space-y-4', 'mt-4')
  })
}) 