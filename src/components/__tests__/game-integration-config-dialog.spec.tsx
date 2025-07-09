import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

vi.mock('@/hooks/useGameIntegration', () => ({
  useGameIntegrationWithId: vi.fn(() => ({
    gameIntegrationWithIdQuery: {
      isLoading: false,
      data: { data: { config: { test: 'value' } } },
      isError: false,
    },
  })),
}))

vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(() => ({
    isAllowed: true,
  })),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, disabled }) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  )),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  )),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <h2 data-testid="dialog-title">{children}</h2>),
  DialogDescription: vi.fn(({ children }) => <p data-testid="dialog-description">{children}</p>),
  DialogFooter: vi.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>),
}))

vi.mock('@/components/json-editor-with-drag-drop', () => ({
  JsonEditorWithDragDrop: vi.fn(({ value, onChange, isLoading, isError, readOnly }) => (
    <div data-testid="json-editor-with-drag-drop" data-loading={isLoading} data-error={isError} data-readonly={readOnly}>
      <textarea
        data-testid="json-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter JSON here"
        readOnly={readOnly}
      />
    </div>
  )),
}))

import { GameIntegrationConfigDialog } from '../game-integration-config-dialog'
import { useGameIntegrationWithId } from '@/hooks/useGameIntegration'
import { usePermission } from '@/hooks/usePermission'
import type { AxiosResponse } from 'axios'

// Helper function to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('GameIntegrationConfigDialog', () => {
  const mockOnOpenChange = vi.fn()
  const mockHandleSubmit = vi.fn()
  const mockExistingGameIntegration = [
    { gameId: 123, operatorId: 'operator-1', config: {} },
    { gameId: 456, operatorId: 'operator-2', config: {} },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameIntegrationWithId).mockReturnValue({
      gameIntegrationWithIdQuery: {
        isLoading: false,
        data: { 
          data: { config: { test: 'value' } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse,
        isError: false,
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
        isStale: false,
        refetch: vi.fn(),
        status: 'success',
        isSuccess: true,
        errorUpdateCount: 0,
        isPaused: false,
        fetchStatus: 'idle',
        promise: Promise.resolve({} as AxiosResponse),
      },
    })
    // Default permission mock - allowed
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: true,
    })
  })

  it('should render the dialog with correct structure', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-footer')).toBeInTheDocument()
    expect(screen.getByTestId('json-editor-with-drag-drop')).toBeInTheDocument()
  })

  it('should render dialog with correct open state', () => {
    // Arrange
    const props = {
      isOpen: false,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })

  it('should render the correct title and description', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    expect(screen.getByText('Game Integration Config')).toBeInTheDocument()
    expect(screen.getByText('Game Integration config for game id 123 and operator id operator-1')).toBeInTheDocument()
    expect(screen.getByText('Paste json below or drag and drop file')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to dialog content', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const dialogContent = screen.getByTestId('dialog-content')
    expect(dialogContent).toHaveClass('!max-w-[1280px]', 'w-[95vw]')
  })

  it('should render submit button', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('should call handleSubmit when submit button is clicked', async () => {
    // Arrange
    mockHandleSubmit.mockResolvedValue(undefined)
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith(expect.any(String))
      const calledValue = mockHandleSubmit.mock.calls[0][0]
      expect(JSON.parse(calledValue)).toEqual({ config: { test: 'value' } })
    })
  })

  it('should initialize JSON editor with existing data when game integration exists', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId<HTMLTextAreaElement>('json-textarea')
    expect(JSON.parse(textarea.value)).toEqual({ config: { test: 'value' } })
  })

  it('should initialize JSON editor with empty object when game integration does not exist', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 999,
      currentOperatorId: 'operator-999',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId<HTMLTextAreaElement>('json-textarea')
    expect(JSON.parse(textarea.value)).toEqual({ config: { test: 'value' } })
  })

  it('should handle JSON editor value changes', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)
    const textarea = screen.getByTestId('json-textarea')
    fireEvent.change(textarea, { target: { value: '{"new": "value"}' } })

    // Assert
    expect(textarea).toHaveValue('{"new": "value"}')
  })

  it('should submit updated JSON value', async () => {
    // Arrange
    mockHandleSubmit.mockResolvedValue(undefined)
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)
    const textarea = screen.getByTestId('json-textarea')
    fireEvent.change(textarea, { target: { value: '{"updated": "value"}' } })
    
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith('{"updated": "value"}')
    })
  })

  it('should show loading state when query is loading', () => {
    // Arrange
    vi.mocked(useGameIntegrationWithId).mockReturnValue({
      gameIntegrationWithIdQuery: {
        isLoading: true,
        data: undefined,
        isError: false,
        error: null,
        isPending: true,
        isLoadingError: false,
        isRefetchError: false,
        isFetching: false,
        isRefetching: false,
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        isFetched: false,
        isFetchedAfterMount: false,
        isInitialLoading: true,
        isPlaceholderData: false,
        isStale: false,
        refetch: vi.fn(),
        status: 'pending',
        isSuccess: false,
        errorUpdateCount: 0,
        isPaused: false,
        fetchStatus: 'fetching',
        promise: Promise.resolve({} as AxiosResponse),
      },
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    expect(jsonEditor).toHaveAttribute('data-loading', 'true')
  })

  it('should show error state when query has error', () => {
    // Arrange
    vi.mocked(useGameIntegrationWithId).mockReturnValue({
      gameIntegrationWithIdQuery: {
        isLoading: false,
        data: undefined,
        isError: true,
        error: new Error('Test error'),
        isPending: false,
        isLoadingError: true,
        isRefetchError: false,
        isFetching: false,
        isRefetching: false,
        dataUpdatedAt: 0,
        errorUpdatedAt: Date.now(),
        failureCount: 1,
        failureReason: new Error('Test error'),
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isStale: false,
        refetch: vi.fn(),
        status: 'error',
        isSuccess: false,
        errorUpdateCount: 1,
        isPaused: false,
        fetchStatus: 'idle',
        promise: Promise.resolve({} as AxiosResponse),
      },
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    expect(jsonEditor).toHaveAttribute('data-error', 'true')
  })

  it('should handle different game IDs and operator IDs', () => {
    // Arrange
    const testCases = [
      { gameId: 1, operatorId: 'op-1' },
      { gameId: 999, operatorId: 'op-999' },
      { gameId: 1000000, operatorId: 'op-large' },
    ]

    // Act & Assert
    testCases.forEach(({ gameId, operatorId }) => {
      renderWithRouter(
        <GameIntegrationConfigDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          handleSubmit={mockHandleSubmit}
          currentGameId={gameId}
          currentOperatorId={operatorId}
          existingGameIntegration={mockExistingGameIntegration}
        />
      )
      expect(screen.getByText(`Game Integration config for game id ${gameId} and operator id ${operatorId}`)).toBeInTheDocument()
      cleanup()
    })
  })

  it('should handle empty existing game integration array', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: [],
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId<HTMLTextAreaElement>('json-textarea')
    expect(JSON.parse(textarea.value)).toEqual({ config: { test: 'value' } })
  })

  it('should handle complex existing game integration data', () => {
    // Arrange
    const complexData = {
      config: {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
          boolean: true,
          null: null,
          number: 42,
          string: 'test',
        },
      },
    }
    vi.mocked(useGameIntegrationWithId).mockReturnValue({
      gameIntegrationWithIdQuery: {
        isLoading: false,
        data: { 
          data: complexData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse,
        isError: false,
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
        isStale: false,
        refetch: vi.fn(),
        status: 'success',
        isSuccess: true,
        errorUpdateCount: 0,
        isPaused: false,
        fetchStatus: 'idle',
        promise: Promise.resolve({} as AxiosResponse),
      },
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const textarea = screen.getByTestId<HTMLTextAreaElement>('json-textarea')
    expect(JSON.parse(textarea.value)).toEqual(complexData)
  })

  it('should handle null game ID and operator ID', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: null,
      currentOperatorId: null,
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    expect(screen.getByText(/Game Integration config for game id/)).toBeInTheDocument()
    expect(screen.getByText(/and operator id/)).toBeInTheDocument()
  })

  it('should handle async handleSubmit function', async () => {
    // Arrange
    const asyncHandleSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: asyncHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(asyncHandleSubmit).toHaveBeenCalledWith(expect.any(String))
      const calledValue = asyncHandleSubmit.mock.calls[0][0]
      expect(JSON.parse(calledValue)).toEqual({ config: { test: 'value' } })
    })
  })

  it('should call usePermission with correct path', () => {
    // Arrange
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    expect(usePermission).toHaveBeenCalledWith({
      path: ['/gameIntegration/upsert']
    })
  })

  it('should disable submit button when permission is not allowed', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: false,
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const submitButton = screen.getByText('Submit')
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when permission is allowed', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: true,
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const submitButton = screen.getByText('Submit')
    expect(submitButton).not.toBeDisabled()
  })

  it('should set JSON editor to read-only when permission is not allowed', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: false,
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    const textarea = screen.getByTestId('json-textarea')
    expect(jsonEditor).toHaveAttribute('data-readonly', 'true')
    expect(textarea).toHaveAttribute('readonly')
  })

  it('should set JSON editor to editable when permission is allowed', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: true,
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)

    // Assert
    const jsonEditor = screen.getByTestId('json-editor-with-drag-drop')
    const textarea = screen.getByTestId('json-textarea')
    expect(jsonEditor).toHaveAttribute('data-readonly', 'false')
    expect(textarea).not.toHaveAttribute('readonly')
  })

  it('should not call handleSubmit when submit button is clicked and permission is not allowed', async () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({
      isAllowed: false,
    })
    const props = {
      isOpen: true,
      onOpenChange: mockOnOpenChange,
      handleSubmit: mockHandleSubmit,
      currentGameId: 123,
      currentOperatorId: 'operator-1',
      existingGameIntegration: mockExistingGameIntegration,
    }

    // Act
    renderWithRouter(<GameIntegrationConfigDialog {...props} />)
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    expect(mockHandleSubmit).not.toHaveBeenCalled()
  })
}) 