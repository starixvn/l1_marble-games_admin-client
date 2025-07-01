import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('@/hooks/useGameConfig', () => ({
  useGameConfig: vi.fn(() => ({
    gameConfigUpsertMutation: {
      mutate: vi.fn(),
      isPending: false,
      data: undefined,
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
  useGameConfigWithId: vi.fn(() => ({
    gameConfigWithIdQuery: {
      isLoading: false,
      data: { data: { gameConfigSchema: 'schema-123', config: {} } },
      isError: false,
      isSuccess: true,
    },
  })),
}))

vi.mock('@/hooks/useGameConfigSchema', () => ({
  useGameConfigSchema: vi.fn(() => ({
    gameConfigSchemaGetQuery: {
      isLoading: false,
      data: { data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' } },
      isError: false,
    },
    gameConfigSchemaListQuery: {
      isLoading: false,
      data: { 
        data: [{ id: 'schema-123', name: 'Test Schema' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as Record<string, unknown>,
      },
      isError: false,
    },
    currentSchemaId: 'schema-123',
    setCurrentSchemaId: vi.fn(),
  })),
}))

vi.mock('@/components/game-config-schema-combobox', () => ({
  GameConfigSchemaCombobox: vi.fn(({ currentSchemaId, setCurrentSchemaId, data }) => (
    <div data-testid="game-config-schema-combobox" data-current-schema-id={currentSchemaId}>
      <div data-testid="combobox-props">
        {JSON.stringify({ currentSchemaId, data })}
      </div>
      <button data-testid="mock-set-schema" onClick={() => setCurrentSchemaId('new-schema')}>
        Set Schema
      </button>
    </div>
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
  default: vi.fn(({ formData, onChange, onSubmit, liveValidate }) => (
    <form data-testid="rjsf-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ formData }); }}>
      <div data-testid="form-props">
        {JSON.stringify({ formData, liveValidate })}
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
  filterDataBySchema: vi.fn((data) => data),
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

import { GameConfigForm } from '../game-config-form'
import { useGameConfig, useGameConfigWithId } from '@/hooks/useGameConfig'
import { useGameConfigSchema } from '@/hooks/useGameConfigSchema'
import { toast } from 'sonner'

describe('GameConfigForm', () => {
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
    vi.mocked(useGameConfig).mockReturnValue({
      gameConfigQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigQuery'],
      gameConfigUpsertMutation: mockGameConfigUpsertMutation,
      currentGameId: null,
      setCurrentGameId: vi.fn(),
      gameConfigWithIdQuery: {} as unknown as ReturnType<typeof useGameConfig>['gameConfigWithIdQuery'],
    })
    vi.mocked(useGameConfigWithId).mockReturnValue({
      gameConfigWithIdQuery: {
        isLoading: false,
        data: { 
          data: { gameConfigSchema: 'schema-123', config: { test: 'value' } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
        isSuccess: true,
        error: null,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isFetching: false,
        isRefetching: false,
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isStale: false,
        refetch: vi.fn(),
        remove: vi.fn(),
        status: 'success',
      } as unknown as ReturnType<typeof useGameConfigWithId>['gameConfigWithIdQuery'],
    })
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { 
          data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { 
          data: [{ id: 'schema-123', name: 'Test Schema' }],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
    })
  })

  it('should render the game config form with correct structure', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Game Config for game id 123')).toBeInTheDocument()
    expect(screen.getByTestId('game-config-schema-combobox')).toBeInTheDocument()
    expect(screen.getByTestId('rjsf-form')).toBeInTheDocument()
  })

  it('should render the heading with correct styling', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={456} />)

    // Assert
    const heading = screen.getByText('Game Config for game id 456')
    expect(heading).toHaveClass('scroll-m-20', 'text-2xl', 'font-extrabold', 'tracking-tight', 'mb-4')
  })

  it('should render the game config schema combobox', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByTestId('game-config-schema-combobox')).toBeInTheDocument()
  })

  it('should render the JSON editor button', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('code-xml-icon')).toBeInTheDocument()
  })

  it('should apply correct styling to JSON editor button', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
    expect(button).toHaveAttribute('data-size', 'icon')
  })

  it('should apply correct styling to code XML icon', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    const icon = screen.getByTestId('code-xml-icon')
    expect(icon).toHaveClass('h-4', 'w-4', 'text-blue-500', 'drop-shadow-lg')
    expect(icon).toHaveAttribute('data-stroke-width', '3')
  })

  it('should open JSON editor dialog when button is clicked', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)
    const jsonButton = screen.getByTestId('button')
    fireEvent.click(jsonButton)

    // Assert
    expect(screen.getByTestId('json-editor-dialog')).toHaveAttribute('data-open', 'true')
  })

  it('should render the form when schema is available', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByTestId('rjsf-form')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to form container', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    const formContainer = screen.getByTestId('rjsf-form').closest('div')
    expect(formContainer).toHaveClass('[&_form]:space-y-4', 'mt-4')
  })

  it('should show loading state when game config query is loading', () => {
    // Arrange
    vi.mocked(useGameConfigWithId).mockReturnValue({
      gameConfigWithIdQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
        isSuccess: false,
      } as unknown as ReturnType<typeof useGameConfigWithId>['gameConfigWithIdQuery'],
    })

    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show error state when game config query has error', () => {
    // Arrange
    vi.mocked(useGameConfigWithId).mockReturnValue({
      gameConfigWithIdQuery: {
        isLoading: false,
        data: undefined,
        isError: true,
        isSuccess: false,
      } as unknown as ReturnType<typeof useGameConfigWithId>['gameConfigWithIdQuery'],
    })

    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should show loading state when schema get query is loading', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaGetQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { 
          data: [{ id: 'schema-123', name: 'Test Schema' }],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
    })

    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show error state when schema get query has error', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: undefined,
        isError: true,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { 
          data: [{ id: 'schema-123', name: 'Test Schema' }],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
    })

    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should show loading state when schema list query is loading', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { 
          data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
      gameConfigSchemaListQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: 'schema-123',
      setCurrentSchemaId: mockSetCurrentSchemaId,
    })

    // Act
    render(<GameConfigForm gameId={123} />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should call gameConfigUpsertMutation when form is submitted', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<GameConfigForm gameId={123} />)
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    expect(mockGameConfigUpsertMutation.mutate).toHaveBeenCalledWith(
      {
        query: {
          gameId: 123,
          schemaId: 'schema-123',
        },
        request: { test: 'value' },
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    )
  })

  it('should show success toast when mutation succeeds', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onSuccess()
    })

    // Act
    render(<GameConfigForm gameId={123} />)
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    expect(toast.success).toHaveBeenCalledWith('Game config updated')
  })

  it('should show error toast when mutation fails', async () => {
    // Arrange
    mockGameConfigUpsertMutation.mutate.mockImplementation((_, options) => {
      options.onError()
    })

    // Act
    render(<GameConfigForm gameId={123} />)
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Failed to update game config')
  })

  it('should not submit when schema ID is missing', () => {
    // Arrange
    vi.mocked(useGameConfigSchema).mockReturnValue({
      gameConfigSchemaGetQuery: {
        isLoading: false,
        data: { 
          data: { schema: { type: 'object', properties: {} }, name: 'Test Schema' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaGetQuery'],
      gameConfigSchemaListQuery: {
        isLoading: false,
        data: { 
          data: [{ id: 'schema-123', name: 'Test Schema' }],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as Record<string, unknown>,
        },
        isError: false,
      } as unknown as ReturnType<typeof useGameConfigSchema>['gameConfigSchemaListQuery'],
      currentSchemaId: null,
      setCurrentSchemaId: mockSetCurrentSchemaId,
    })

    // Act
    render(<GameConfigForm gameId={123} />)
    const formSubmit = screen.getByTestId('form-submit')
    fireEvent.click(formSubmit)

    // Assert
    expect(mockGameConfigUpsertMutation.mutate).not.toHaveBeenCalled()
  })

  it('should handle JSON editor submission', () => {
    // Arrange
    // Act
    render(<GameConfigForm gameId={123} />)
    const jsonButton = screen.getByTestId('button')
    fireEvent.click(jsonButton)
    
    const mockSubmitButton = screen.getByTestId('mock-json-submit')
    fireEvent.click(mockSubmitButton)

    // Assert
    expect(screen.getByTestId('json-editor-dialog')).toBeInTheDocument()
  })

  it('should handle different game IDs', () => {
    // Arrange
    const gameIds = [1, 999, 1000000]

    // Act & Assert
    gameIds.forEach(gameId => {
      render(<GameConfigForm gameId={gameId} />)
      expect(screen.getByText(`Game Config for game id ${gameId}`)).toBeInTheDocument()
      cleanup()
    })
  })
}) 