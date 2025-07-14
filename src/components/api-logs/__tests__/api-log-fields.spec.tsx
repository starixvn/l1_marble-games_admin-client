import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogFields } from '../api-log-fields'
import type { OperatorListResponse } from '@/api/operator.api'
import type { AxiosResponse } from 'axios'

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(),
}))

vi.mock('@/hooks/useGameConfig', () => ({
  useGameConfig: vi.fn(),
}))

vi.mock('@/components/game-integration-table', () => ({
  OperatorIdCombobox: vi.fn(),
  GameIdCombobox: vi.fn(),
}))

vi.mock('@/components/datetime-picker', () => ({
  DateTimePicker24h: vi.fn(),
}))

vi.mock('@/components/combobox', () => ({
  Combobox: vi.fn(),
}))

import { useOperator } from '@/hooks/useOperator'
import { useGameConfig } from '@/hooks/useGameConfig'
import { OperatorIdCombobox, GameIdCombobox } from '@/components/game-integration-table'
import { DateTimePicker24h } from '@/components/datetime-picker'
import { Combobox } from '@/components/combobox'

const mockUseOperator = vi.mocked(useOperator)
const mockUseGameConfig = vi.mocked(useGameConfig)
const mockOperatorIdCombobox = vi.mocked(OperatorIdCombobox)
const mockGameIdCombobox = vi.mocked(GameIdCombobox)
const mockDateTimePicker24h = vi.mocked(DateTimePicker24h)
const mockCombobox = vi.mocked(Combobox)

describe('ApiLogFields', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    const mockOperators: OperatorListResponse[] = [
      { id: 'operator1', name: 'Operator 1' },
      { id: 'operator2', name: 'Operator 2' },
    ]

    const mockOperatorsQuery = {
      data: { data: mockOperators } as AxiosResponse<OperatorListResponse[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
      isLoadingError: false,
      isRefetchError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      failureCount: 0,
      failureReason: null,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: vi.fn(),
      status: 'success' as const,
      fetchStatus: 'idle' as const,
      error: null,
      errorUpdateCount: 0,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
    }

    const mockGameConfigQuery = {
      data: { 
        data: [
          { gameId: 1, name: 'Game 1' },
          { gameId: 2, name: 'Game 2' },
          { gameId: 3, name: 'Game 3' },
        ]
      } as AxiosResponse<Array<{ gameId: number; name: string }>>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
      isLoadingError: false,
      isRefetchError: false,
      isFetched: true,
      isFetchedAfterMount: true,
      failureCount: 0,
      failureReason: null,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: vi.fn(),
      status: 'success' as const,
      fetchStatus: 'idle' as const,
      error: null,
      errorUpdateCount: 0,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
    }

    mockUseOperator.mockReturnValue({
      operatorsQuery: mockOperatorsQuery as unknown as ReturnType<typeof useOperator>['operatorsQuery'],
      createOperatorMutation: {} as ReturnType<typeof useOperator>['createOperatorMutation'],
      updateOperatorNameMutation: {} as ReturnType<typeof useOperator>['updateOperatorNameMutation'],
      generatePasswordMutation: {} as ReturnType<typeof useOperator>['generatePasswordMutation'],
    })

    mockUseGameConfig.mockReturnValue({
      gameConfigQuery: mockGameConfigQuery as unknown as ReturnType<typeof useGameConfig>['gameConfigQuery'],
      gameConfigUpsertMutation: {} as ReturnType<typeof useGameConfig>['gameConfigUpsertMutation'],
      currentGameId: null,
      setCurrentGameId: vi.fn(),
      gameConfigWithIdQuery: {} as ReturnType<typeof useGameConfig>['gameConfigWithIdQuery'],
    })

    mockOperatorIdCombobox.mockImplementation(({ currentOperatorId, setCurrentOperatorId }) => (
      <div data-testid="operator-combobox">
        <button onClick={() => setCurrentOperatorId('operator1')}>Select Operator</button>
        <span data-testid="current-operator">{currentOperatorId ?? 'none'}</span>
      </div>
    ))

    mockGameIdCombobox.mockImplementation(({ currentGameId, setCurrentGameId }) => (
      <div data-testid="game-id-combobox">
        <button onClick={() => setCurrentGameId(1)}>Select Game</button>
        <span data-testid="current-game-id">{currentGameId ?? 'none'}</span>
      </div>
    ))

    mockDateTimePicker24h.mockImplementation(({ label, date, setDate }) => (
      <div data-testid={`datetime-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <span data-testid={`${label.toLowerCase().replace(/\s+/g, '-')}-value`}>
          {date?.toISOString?.() ?? ''}
        </span>
        <button onClick={() => setDate(new Date('2024-01-01T12:00:00Z'))}>
          Set {label}
        </button>
      </div>
    ))

    mockCombobox.mockImplementation(({ currentValue, setCurrentValue, list }) => (
      <div data-testid="endpoint-combobox">
        <span data-testid="current-endpoint">{currentValue ?? 'none'}</span>
        {(list as Array<{ url: string; name: string }>).map((item) => (
          <button key={item.url} onClick={() => setCurrentValue?.(item.url)}>
            {item.name}
          </button>
        ))}
      </div>
    ))
  })

  it('should render all form fields', () => {
    // Arrange & Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByTestId('datetime-start-time-(utc)')).toBeInTheDocument()
    expect(screen.getByTestId('datetime-end-time-(utc)')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('should render operator combobox with data', () => {
    // Arrange & Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.getByTestId('operator-combobox')).toBeInTheDocument()
    expect(mockOperatorIdCombobox).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'w-[300px] lg:w-auto',
        operatorIds: [
          { id: 'operator1', name: 'Operator 1' },
          { id: 'operator2', name: 'Operator 2' },
        ],
        currentOperatorId: null,
        setCurrentOperatorId: expect.any(Function),
      }),
      undefined
    )
  })

  it('should render datetime pickers with default values', () => {
    // Arrange & Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.getByTestId('datetime-start-time-(utc)')).toBeInTheDocument()
    expect(screen.getByTestId('datetime-end-time-(utc)')).toBeInTheDocument()
    
    // Check that datetime pickers were called with default dates
    expect(mockDateTimePicker24h).toHaveBeenCalledTimes(2)
  })

  it('should initialize with current day start and end times', () => {
    // Arrange
    const mockDate = new Date('2024-01-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    // Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(mockDateTimePicker24h).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Start Time (UTC)',
        date: new Date('2024-01-15T00:00:00.000Z'), // Current day at 00:00:00.000 UTC
        setDate: expect.any(Function),
      }),
      undefined
    )

    expect(mockDateTimePicker24h).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'End Time (UTC)',
        date: new Date('2024-01-15T23:59:59.000Z'), // Current day at 23:59:59.000 UTC
        setDate: expect.any(Function),
      }),
      undefined
    )

    // Cleanup
    vi.useRealTimers()
  })

  it('should render endpoint combobox with predefined options', () => {
    // Arrange & Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.getByTestId('endpoint-combobox')).toBeInTheDocument()
    expect(mockCombobox).toHaveBeenCalledWith(
      expect.objectContaining({
        list: [
          { url: '/api/schedule', name: 'Schedule' },
          { url: '/api/events', name: 'Events' },
        ],
        currentValue: null,
        setCurrentValue: expect.any(Function),
        keyProp: 'url',
        valueProp: 'url',
        valueFormatter: expect.any(Function),
      }),
      undefined
    )
  })

  it('should not render Game ID and Event ID fields when endpoint is not events', () => {
    // Arrange & Act
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.queryByText('Game ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Event ID')).not.toBeInTheDocument()
    expect(screen.queryByTestId('game-id-combobox')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Event ID')).not.toBeInTheDocument()
  })

  it('should render Game ID and Event ID fields when endpoint is events', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Events'))

    // Assert
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByText('Event ID')).toBeInTheDocument()
    expect(screen.getByTestId('game-id-combobox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Event ID')).toBeInTheDocument()
  })

  it('should render game ID combobox with data from useGameConfig', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Events'))

    // Assert
    expect(screen.getByTestId('game-id-combobox')).toBeInTheDocument()
    expect(mockGameIdCombobox).toHaveBeenCalledWith(
      expect.objectContaining({
        gameIds: [1, 2, 3],
        currentGameId: null,
        setCurrentGameId: expect.any(Function),
      }),
      undefined
    )
  })

  it('should handle form submission with default values', () => {
    // Arrange
    const mockDate = new Date('2024-01-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        operator: undefined,
        endpoint: undefined,
        eventId: undefined,
        gameId: undefined,
        startDate: expect.stringMatching(/2024-01-1[45]T\d{2}:00:00\.000Z/),
        endDate: expect.stringMatching(/2024-01-1[45]T\d{2}:59:59\.000Z/),
      })
    )

    // Cleanup
    vi.useRealTimers()
  })

  it('should handle operator selection', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        operator: 'operator1',
      })
    )
  })

  it('should handle endpoint selection', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Schedule'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/api/schedule',
      })
    )
  })

  it('should handle datetime changes', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Set Start Time (UTC)'))
    fireEvent.click(screen.getByText('Set End Time (UTC)'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2024-01-01T12:00:00.000Z',
        endDate: '2024-01-01T12:00:00.000Z',
      })
    )
  })

  it('should handle game ID selection when endpoint is events', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Events'))
    fireEvent.click(screen.getByText('Select Game'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/api/events',
        gameId: '1',
      })
    )
  })

  it('should handle event ID input when endpoint is events', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Events'))
    const eventIdInput = screen.getByPlaceholderText('Event ID')
    fireEvent.change(eventIdInput, { target: { value: '12345' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/api/events',
        eventId: '12345',
      })
    )
  })

  it('should not include eventId and gameId when endpoint is not events', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Schedule'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/api/schedule',
        eventId: undefined,
        gameId: undefined,
      })
    )
  })

  it('should handle multiple field selections', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.click(screen.getByText('Events'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        operator: 'operator1',
        endpoint: '/api/events',
      })
    )
  })

  it('should handle form submission with all fields populated for events endpoint', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.click(screen.getByText('Events'))
    fireEvent.click(screen.getByText('Select Game'))
    fireEvent.click(screen.getByText('Set Start Time (UTC)'))
    fireEvent.click(screen.getByText('Set End Time (UTC)'))
    const eventIdInput = screen.getByPlaceholderText('Event ID')
    fireEvent.change(eventIdInput, { target: { value: '12345' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      operator: 'operator1',
      startDate: '2024-01-01T12:00:00.000Z',
      endDate: '2024-01-01T12:00:00.000Z',
      endpoint: '/api/events',
      eventId: '12345',
      gameId: '1',
    })
  })

  it('should handle form submission with all fields populated for schedule endpoint', () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.click(screen.getByText('Schedule'))
    fireEvent.click(screen.getByText('Set Start Time (UTC)'))
    fireEvent.click(screen.getByText('Set End Time (UTC)'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      operator: 'operator1',
      startDate: '2024-01-01T12:00:00.000Z',
      endDate: '2024-01-01T12:00:00.000Z',
      endpoint: '/api/schedule',
      eventId: undefined,
      gameId: undefined,
    })
  })
})
