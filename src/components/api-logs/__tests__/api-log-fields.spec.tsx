import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogFields } from '../api-log-fields'
import type { ApiLogFieldsProps } from '../api-log-fields'
import type { OperatorListResponse } from '@/api/operator.api'
import type { AxiosResponse } from 'axios'

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(),
}))

vi.mock('@/components/game-integration-table', () => ({
  OperatorIdCombobox: vi.fn(),
}))

vi.mock('@/components/datetime-picker', () => ({
  DateTimePicker24h: vi.fn(),
}))

vi.mock('@/components/combobox', () => ({
  Combobox: vi.fn(),
}))

import { useOperator } from '@/hooks/useOperator'
import { OperatorIdCombobox } from '@/components/game-integration-table'
import { DateTimePicker24h } from '@/components/datetime-picker'
import { Combobox } from '@/components/combobox'

const mockUseOperator = vi.mocked(useOperator)
const mockOperatorIdCombobox = vi.mocked(OperatorIdCombobox)
const mockDateTimePicker24h = vi.mocked(DateTimePicker24h)
const mockCombobox = vi.mocked(Combobox)

describe('ApiLogFields', () => {
  const mockOnSubmit: ApiLogFieldsProps['onSubmit'] = vi.fn()

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

    mockUseOperator.mockReturnValue({
      operatorsQuery: mockOperatorsQuery as unknown as ReturnType<typeof useOperator>['operatorsQuery'],
      createOperatorMutation: {} as ReturnType<typeof useOperator>['createOperatorMutation'],
      updateOperatorNameMutation: {} as ReturnType<typeof useOperator>['updateOperatorNameMutation'],
      generatePasswordMutation: {} as ReturnType<typeof useOperator>['generatePasswordMutation'],
    })

    mockOperatorIdCombobox.mockImplementation(({ currentOperatorId, setCurrentOperatorId }) => (
      <div data-testid="operator-combobox">
        <button onClick={() => setCurrentOperatorId('operator1')}>Select Operator</button>
        <span data-testid="current-operator">{currentOperatorId ?? 'none'}</span>
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

  it('should handle form submission with default values', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        operator: undefined,
        startDate: expect.any(String),
        endDate: expect.any(String),
        endpoint: undefined,
      })
    })
  })

  it('should handle operator selection', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          operator: 'operator1',
        })
      )
    })
  })

  it('should handle endpoint selection', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Schedule'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: '/api/schedule',
        })
      )
    })
  })

  it('should handle datetime changes', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Set Start Time (UTC)'))
    fireEvent.click(screen.getByText('Set End Time (UTC)'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: '2024-01-01T12:00:00.000Z',
          endDate: '2024-01-01T12:00:00.000Z',
        })
      )
    })
  })

  it('should handle multiple field selections', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.click(screen.getByText('Events'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          operator: 'operator1',
          endpoint: '/api/events',
        })
      )
    })
  })

  it('should handle form submission with all fields populated', async () => {
    // Arrange
    render(<ApiLogFields onSubmit={mockOnSubmit} />)

    // Act
    fireEvent.click(screen.getByText('Select Operator'))
    fireEvent.click(screen.getByText('Schedule'))
    fireEvent.click(screen.getByText('Set Start Time (UTC)'))
    fireEvent.click(screen.getByText('Set End Time (UTC)'))
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }))

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        operator: 'operator1',
        startDate: '2024-01-01T12:00:00.000Z',
        endDate: '2024-01-01T12:00:00.000Z',
        endpoint: '/api/schedule',
      })
    })
  })
})
