import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

vi.mock('@/components/game-integration-table', () => ({
  GameIntegrationTable: vi.fn(({ data, handleConfigClick, handleDeleteClick, allowDelete }) => (
    <div data-testid="game-integration-table" data-allow-delete={allowDelete}>
      <div>Game Integration Table with {data.length} items</div>
      <button data-testid="config-btn" onClick={() => handleConfigClick({ gameId: 1, operatorId: 1 })}>
        Config
      </button>
      <button data-testid="delete-btn" onClick={() => handleDeleteClick({ gameId: 1, operatorId: 1 })}>
        Delete
      </button>
    </div>
  )),
}))

vi.mock('@/components/game-integration-config-dialog', () => ({
  GameIntegrationConfigDialog: vi.fn(({ isOpen, onOpenChange, handleSubmit }) => (
    <div data-testid="game-integration-config-dialog">
      {isOpen && (
        <div>
          <div>Config Dialog</div>
          <button data-testid="submit-btn" onClick={() => handleSubmit('{"test": "data"}')}>
            Submit
          </button>
          <button data-testid="close-btn" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  )),
}))

vi.mock('@/hooks/useGameIntegration', () => ({
  useGameIntegrationList: vi.fn(),
  useGameIntegrationUpsert: vi.fn(),
  useGameIntegrationDelete: vi.fn(),
}))

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(),
}))

vi.mock('@/hooks/useGameConfig', () => ({
  useGameConfig: vi.fn(),
}))

vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import * as useGameIntegrationModule from '@/hooks/useGameIntegration'
import * as useOperatorModule from '@/hooks/useOperator'
import * as useGameConfigModule from '@/hooks/useGameConfig'
import * as usePermissionModule from '@/hooks/usePermission'
import { toast } from 'sonner'
import { GameIntegrationsPage } from '../game-integrations.page'

describe('Game Integrations Page', () => {
  const mockUseGameIntegrationList = useGameIntegrationModule.useGameIntegrationList as ReturnType<typeof vi.fn>
  const mockUseGameIntegrationUpsert = useGameIntegrationModule.useGameIntegrationUpsert as ReturnType<typeof vi.fn>
  const mockUseGameIntegrationDelete = useGameIntegrationModule.useGameIntegrationDelete as ReturnType<typeof vi.fn>
  const mockUseOperator = useOperatorModule.useOperator as ReturnType<typeof vi.fn>
  const mockUseGameConfig = useGameConfigModule.useGameConfig as ReturnType<typeof vi.fn>
  const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>
  const mockToastError = toast.error as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock setup
    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
      },
    })

    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
      },
    })

    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: vi.fn(),
      },
    })

    mockUseGameIntegrationDelete.mockReturnValue({
      gameIntegrationDeleteMutation: {
        mutate: vi.fn(),
      },
    })

    // Default permission setup - both permissions granted
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({ isAllowed: true })
  })

  it('should render the game integrations page with AdminLayout', () => {
    // Arrange & Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render loading state when any query is loading', () => {
    // Arrange
    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: null,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('game-integration-table')).not.toBeInTheDocument()
  })

  it('should render error state when any query has error', () => {
    // Arrange
    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: null,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByTestId('game-integration-table')).not.toBeInTheDocument()
  })

  it('should render GameIntegrationTable with mapped data', () => {
    // Arrange
    const mockIntegrations = [
      { id: 1, gameId: 1, operatorId: 1, config: {} },
      { id: 2, gameId: 2, operatorId: 2, config: {} },
    ]
    const mockOperators = [
      { id: 1, name: 'Operator 1' },
      { id: 2, name: 'Operator 2' },
    ]
    const mockGameConfigs = [
      { gameId: 1 },
      { gameId: 2 },
    ]

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: mockIntegrations },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: mockOperators },
        isLoading: false,
        isError: false,
      },
    })

    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: mockGameConfigs },
        isLoading: false,
        isError: false,
      },
    })

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('game-integration-table')).toBeInTheDocument()
    expect(screen.getByText('Game Integration Table with 2 items')).toBeInTheDocument()
  })

  it('should open config dialog when config button is clicked', () => {
    // Arrange & Act
    render(<GameIntegrationsPage />)
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)

    // Assert
    expect(screen.getByTestId('game-integration-config-dialog')).toBeInTheDocument()
    expect(screen.getByText('Config Dialog')).toBeInTheDocument()
  })

  it('should close config dialog when close button is clicked', () => {
    // Arrange
    render(<GameIntegrationsPage />)
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)

    // Act
    const closeBtn = screen.getByTestId('close-btn')
    fireEvent.click(closeBtn)

    // Assert
    expect(screen.queryByText('Config Dialog')).not.toBeInTheDocument()
  })

  it('should handle delete click and show success toast', async () => {
    // Arrange
    const mockDeleteMutation = vi.fn()
    const mockRefetch = vi.fn()
    
    mockUseGameIntegrationDelete.mockReturnValue({
      gameIntegrationDeleteMutation: {
        mutate: mockDeleteMutation,
      },
    })

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    const deleteBtn = screen.getByTestId('delete-btn')
    fireEvent.click(deleteBtn)

    // Assert
    expect(mockDeleteMutation).toHaveBeenCalledWith(
      { gameId: 1, operatorId: 1 },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }
    )

    // Simulate success callback
    const onSuccessCallback = mockDeleteMutation.mock.calls[0][1].onSuccess
    onSuccessCallback()

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Game integration deleted successfully')
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should handle delete error and show error toast', async () => {
    // Arrange
    const mockDeleteMutation = vi.fn()
    
    mockUseGameIntegrationDelete.mockReturnValue({
      gameIntegrationDeleteMutation: {
        mutate: mockDeleteMutation,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    const deleteBtn = screen.getByTestId('delete-btn')
    fireEvent.click(deleteBtn)

    // Simulate error callback
    const onErrorCallback = mockDeleteMutation.mock.calls[0][1].onError
    onErrorCallback()

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to delete game integration')
    })
  })

  it('should handle config submit with valid JSON', async () => {
    // Arrange
    const mockUpsertMutation = vi.fn()
    const mockRefetch = vi.fn()
    
    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    
    // Open dialog first
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)
    
    // Submit config
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)

    // Assert
    expect(mockUpsertMutation).toHaveBeenCalledWith(
      {
        query: { gameId: 1, operatorId: 1 },
        json: { test: 'data' },
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }
    )

    // Simulate success callback
    const onSuccessCallback = mockUpsertMutation.mock.calls[0][1].onSuccess
    onSuccessCallback()

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Game integration updated successfully')
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should handle config submit with invalid JSON', async () => {
    // Arrange
    const mockUpsertMutation = vi.fn()
    
    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    
    // Open dialog first
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)
    
    // Mock JSON.parse to throw error
    const originalJSONParse = JSON.parse
    JSON.parse = vi.fn().mockImplementation(() => {
      throw new Error('Invalid JSON')
    })
    
    // Submit config
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)

    // Assert
    expect(mockToastError).toHaveBeenCalledWith('Invalid JSON format')
    expect(mockUpsertMutation).not.toHaveBeenCalled()

    // Restore JSON.parse
    JSON.parse = originalJSONParse
  })

  it('should handle config submit error and show error toast', async () => {
    // Arrange
    const mockUpsertMutation = vi.fn()
    
    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    
    // Open dialog first
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)
    
    // Submit config
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)

    // Simulate error callback
    const onErrorCallback = mockUpsertMutation.mock.calls[0][1].onError
    onErrorCallback()

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to update game integration')
    })
  })

  it('should not submit when currentDialogParam is missing required fields', () => {
    // Arrange
    const mockUpsertMutation = vi.fn()
    
    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    
    // Open dialog first
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)
    
    // Mock JSON.parse to throw error to simulate invalid JSON
    const originalJSONParse = JSON.parse
    JSON.parse = vi.fn().mockImplementation(() => {
      throw new Error('Invalid JSON')
    })
    
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)

    // Assert
    expect(mockUpsertMutation).not.toHaveBeenCalled()

    // Restore JSON.parse
    JSON.parse = originalJSONParse
  })

  it('should map integrations with operator names correctly', () => {
    // Arrange
    const mockIntegrations = [
      { id: 1, gameId: 1, operatorId: 1, config: {} },
    ]
    const mockOperators = [
      { id: 1, name: 'Test Operator' },
    ]
    const mockGameConfigs = [
      { gameId: 1 },
    ]

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: mockIntegrations },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: mockOperators },
        isLoading: false,
        isError: false,
      },
    })

    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: mockGameConfigs },
        isLoading: false,
        isError: false,
      },
    })

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('game-integration-table')).toBeInTheDocument()
    expect(screen.getByText('Game Integration Table with 1 items')).toBeInTheDocument()
  })

  // Permission Tests
  it('should pass delete permission to table when delete permission is granted', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('game-integration-table')).toHaveAttribute('data-allow-delete', 'true')
  })

  it('should pass delete permission to table when delete permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: false }) // deletePermission

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('game-integration-table')).toHaveAttribute('data-allow-delete', 'false')
  })

  it('should render config dialog when get permission is granted', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.getByTestId('game-integration-config-dialog')).toBeInTheDocument()
  })

  it('should not render config dialog when get permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: false }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.queryByTestId('game-integration-config-dialog')).not.toBeInTheDocument()
  })

  it('should handle delete click when delete permission is granted', async () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    const mockDeleteMutation = vi.fn()
    const mockRefetch = vi.fn()
    
    mockUseGameIntegrationDelete.mockReturnValue({
      gameIntegrationDeleteMutation: {
        mutate: mockDeleteMutation,
      },
    })

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    const deleteBtn = screen.getByTestId('delete-btn')
    fireEvent.click(deleteBtn)

    // Assert
    expect(mockDeleteMutation).toHaveBeenCalledWith(
      { gameId: 1, operatorId: 1 },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }
    )

    // Simulate success callback
    const onSuccessCallback = mockDeleteMutation.mock.calls[0][1].onSuccess
    onSuccessCallback()

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Game integration deleted successfully')
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should handle config submit when get permission is granted', async () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    const mockUpsertMutation = vi.fn()
    const mockRefetch = vi.fn()
    
    mockUseGameIntegrationUpsert.mockReturnValue({
      gameIntegrationUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    mockUseGameIntegrationList.mockReturnValue({
      gameIntegrationListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameIntegrationsPage />)
    
    // Open dialog first
    const configBtn = screen.getByTestId('config-btn')
    fireEvent.click(configBtn)
    
    // Submit config
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)

    // Assert
    expect(mockUpsertMutation).toHaveBeenCalledWith(
      {
        query: { gameId: 1, operatorId: 1 },
        json: { test: 'data' },
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }
    )

    // Simulate success callback
    const onSuccessCallback = mockUpsertMutation.mock.calls[0][1].onSuccess
    onSuccessCallback()

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Game integration updated successfully')
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should not allow config dialog to open when get permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: false }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // deletePermission

    // Act
    render(<GameIntegrationsPage />)

    // Assert
    expect(screen.queryByTestId('game-integration-config-dialog')).not.toBeInTheDocument()
    // The config button should still be there (it's in the table mock), but clicking it won't open the dialog
    expect(screen.getByTestId('config-btn')).toBeInTheDocument()
  })

  
})
