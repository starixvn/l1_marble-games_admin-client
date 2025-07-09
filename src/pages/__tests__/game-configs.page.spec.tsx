import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('react-router', () => ({
  useParams: vi.fn(),
}))

vi.mock('@/hooks/useGameConfig', () => ({
  useGameConfig: vi.fn(),
}))

vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))

vi.mock('@/components/game-config-table', () => ({
  GameConfigTable: vi.fn(({ data, readonly }) => (
    <div data-testid="game-config-table" data-readonly={readonly}>
      Game Config Table with {data?.length ?? 0} items
    </div>
  )),
}))

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

vi.mock('@/components/game-config-form', () => ({
  GameConfigForm: vi.fn(({ gameId }) => <div data-testid="game-config-form">Game Config Form for game {gameId}</div>),
}))

vi.mock('@/components/new-game-form', () => ({
  default: vi.fn(() => <div data-testid="new-game-form">New Game Form</div>),
}))

vi.mock('@/components/full-page-skeleton', () => ({
  FullpageSkeleton: vi.fn(() => <div data-testid="full-page-skeleton">Loading...</div>),
}))

vi.mock('@/components/error-table', () => ({
  ErrorTable: vi.fn(({ onClick }) => (
    <div data-testid="error-table">
      <button data-testid="retry-btn" onClick={onClick}>
        Retry
      </button>
    </div>
  )),
}))

import { useParams } from 'react-router'
import * as useGameConfigModule from '@/hooks/useGameConfig'
import * as usePermissionModule from '@/hooks/usePermission'
import GameConfigsPage from '../game-configs.page'

describe('Game Configs Page', () => {
  const mockUseParams = useParams as ReturnType<typeof vi.fn>
  const mockUseGameConfig = useGameConfigModule.useGameConfig as ReturnType<typeof vi.fn>
  const mockUsePermission = usePermissionModule.usePermission as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ gameId: undefined })
    // Default permission setup - allow upsert permission
    mockUsePermission.mockReturnValue({ isAllowed: true })
  })

  it('should render the game configs page with AdminLayout', () => {
    // Arrange
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render loading state with FullpageSkeleton', () => {
    // Arrange
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: null,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('full-page-skeleton')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('game-config-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
  })

  it('should render error state with ErrorTable', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: null,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('error-table')).toBeInTheDocument()
    expect(screen.getByTestId('retry-btn')).toBeInTheDocument()
    expect(screen.queryByTestId('game-config-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should call refetch when retry button is clicked', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: null,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameConfigsPage />)
    const retryBtn = screen.getByTestId('retry-btn')
    retryBtn.click()

    // Assert
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should render success state with GameConfigTable', () => {
    // Arrange
    const mockGameConfigs = [
      { id: 1, name: 'Config 1' },
      { id: 2, name: 'Config 2' },
    ]
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: mockGameConfigs },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 2 items')).toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should render empty game config table when no data is available', () => {
    // Arrange
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 0 items')).toBeInTheDocument()
  })

  it('should render empty game config table when data is null', () => {
    // Arrange
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: null,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 0 items')).toBeInTheDocument()
  })

  it('should not render any form when gameId is undefined', () => {
    // Arrange
    mockUseParams.mockReturnValue({ gameId: undefined })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.queryByTestId('game-config-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('new-game-form')).not.toBeInTheDocument()
  })

  it('should render NewGameForm when gameId is NaN', () => {
    // Arrange
    mockUseParams.mockReturnValue({ gameId: 'invalid' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('new-game-form')).toBeInTheDocument()
    expect(screen.getByText('New Game Form')).toBeInTheDocument()
    expect(screen.queryByTestId('game-config-form')).not.toBeInTheDocument()
  })

  it('should render GameConfigForm when gameId is a valid number', () => {
    // Arrange
    mockUseParams.mockReturnValue({ gameId: '123' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-form')).toBeInTheDocument()
    expect(screen.getByText('Game Config Form for game 123')).toBeInTheDocument()
    expect(screen.queryByTestId('new-game-form')).not.toBeInTheDocument()
  })

  it('should apply correct styling to form container', () => {
    // Arrange
    mockUseParams.mockReturnValue({ gameId: '123' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    const formContainer = screen.getByTestId('game-config-form').parentElement
    expect(formContainer).toHaveClass('mx-2')
  })

  it('should render both table and form when gameId is valid', () => {
    // Arrange
    mockUseParams.mockReturnValue({ gameId: '456' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [{ id: 1, name: 'Config 1' }] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByTestId('game-config-form')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 1 items')).toBeInTheDocument()
    expect(screen.getByText('Game Config Form for game 456')).toBeInTheDocument()
  })

  it('should render table in read-only mode when permission is denied', () => {
    // Arrange
    mockUsePermission.mockReturnValue({ isAllowed: false })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [{ id: 1, name: 'Config 1' }] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 1 items')).toBeInTheDocument()
    // The table should be rendered with readonly=true when permission is denied
    expect(screen.getByTestId('game-config-table')).toHaveAttribute('data-readonly', 'true')
  })

  it('should render table in editable mode when permission is granted', () => {
    // Arrange
    mockUsePermission.mockReturnValue({ isAllowed: true })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [{ id: 1, name: 'Config 1' }] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.getByText('Game Config Table with 1 items')).toBeInTheDocument()
    // The table should be rendered with readonly=false when permission is granted
    expect(screen.getByTestId('game-config-table')).toHaveAttribute('data-readonly', 'false')
  })

  it('should not render form when permission is denied', () => {
    // Arrange
    mockUsePermission.mockReturnValue({ isAllowed: false })
    mockUseParams.mockReturnValue({ gameId: '123' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.queryByTestId('game-config-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('new-game-form')).not.toBeInTheDocument()
  })

  it('should not render form when permission is denied even with valid gameId', () => {
    // Arrange
    mockUsePermission.mockReturnValue({ isAllowed: false })
    mockUseParams.mockReturnValue({ gameId: '456' })
    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: {
        data: { data: [{ id: 1, name: 'Config 1' }] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigsPage />)

    // Assert
    expect(screen.getByTestId('game-config-table')).toBeInTheDocument()
    expect(screen.queryByTestId('game-config-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('new-game-form')).not.toBeInTheDocument()
  })
})
