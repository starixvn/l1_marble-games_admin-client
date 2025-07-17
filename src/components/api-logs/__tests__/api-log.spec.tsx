import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLog } from '../api-log'
import type { ApiLogResponseItem, ApiLogQuery } from '@/api/api-log.api'
import type { AxiosResponse } from 'axios'

// Mock external dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/hooks/useApiLog', () => ({
  useApiLog: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-fields', () => ({
  ApiLogFields: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-table', () => ({
  ApiLogTable: vi.fn(),
}))

// Import mocked functions
import { toast } from 'sonner'
import { useApiLog } from '@/hooks/useApiLog'
import { ApiLogFields } from '@/components/api-logs/api-log-fields'
import { ApiLogTable } from '@/components/api-logs/api-log-table'

const mockToast = vi.mocked(toast)
const mockUseApiLog = vi.mocked(useApiLog)
const mockApiLogFields = vi.mocked(ApiLogFields)
const mockApiLogTable = vi.mocked(ApiLogTable)

describe('ApiLog', () => {
  let capturedApiQuery: ApiLogQuery | null

  beforeEach(() => {
    vi.clearAllMocks()
    capturedApiQuery = null
    
    // Default mock implementations
    mockApiLogFields.mockImplementation(({ onSubmit }) => (
      <div data-testid="api-log-fields">
        <button onClick={() => onSubmit({
          startDate: '2024-01-01T10:00:00Z',
          endDate: '2024-01-01T11:00:00Z',
        })}>Submit</button>
      </div>
    ))
    
    mockApiLogTable.mockImplementation(({ apiQuery, data, isLoading, isError }) => {
      capturedApiQuery = apiQuery
      return (
        <div data-testid="api-log-table">
          <span data-testid="data-length">{data.length}</span>
          <span data-testid="is-loading">{isLoading.toString()}</span>
          <span data-testid="is-error">{isError.toString()}</span>
          <span data-testid="api-query-endpoint">{apiQuery?.endpoint || 'no-endpoint'}</span>
          <span data-testid="api-query-game-id">{apiQuery?.gameId || 'no-game-id'}</span>
          <span data-testid="api-query-event-id">{apiQuery?.eventId || 'no-event-id'}</span>
        </div>
      )
    })
  })

  it('should render ApiLogFields and ApiLogTable with default state', () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(screen.getByTestId('api-log-fields')).toBeInTheDocument()
    expect(screen.getByTestId('api-log-table')).toBeInTheDocument()
    expect(screen.getByTestId('data-length')).toHaveTextContent('0')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    expect(screen.getByTestId('is-error')).toHaveTextContent('false')
  })

  it('should handle form submission with valid date range', async () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)
    fireEvent.click(screen.getByText('Submit'))

    // Assert
    await waitFor(() => {
      expect(mockUseApiLog).toHaveBeenCalledWith({
        startDate: '2024-01-01T10:00:00Z',
        endDate: '2024-01-01T11:00:00Z',
      })
    })
  })

  it('should show error toast when start date is after end date', async () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    mockApiLogFields.mockImplementation(({ onSubmit }) => (
      <div data-testid="api-log-fields">
        <button onClick={() => onSubmit({
          startDate: '2024-01-01T11:00:00Z',
          endDate: '2024-01-01T10:00:00Z',
        })}>Submit Invalid</button>
      </div>
    ))

    // Act
    render(<ApiLog />)
    fireEvent.click(screen.getByText('Submit Invalid'))

    // Assert
    expect(mockToast.error).toHaveBeenCalledWith('Start date must be before end date')
  })

  it('should show error toast when date range exceeds 24 hours', async () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    mockApiLogFields.mockImplementation(({ onSubmit }) => (
      <div data-testid="api-log-fields">
        <button onClick={() => onSubmit({
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-19T00:00:00Z', // 7 days later
        })}>Submit Long Range</button>
      </div>
    ))

    // Act
    render(<ApiLog />)
    fireEvent.click(screen.getByText('Submit Long Range'))

    // Assert
    expect(mockToast.error).toHaveBeenCalledWith('Query time range must be within 7 days')
  })

  it('should handle loading state', () => {
    // Arrange
    mockUseApiLog.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
  })

  it('should handle error state', () => {
    // Arrange
    mockUseApiLog.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new Error('API Error'),
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(screen.getByTestId('is-error')).toHaveTextContent('true')
  })

  it('should handle data with API logs', () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = [
      {
        id: '1',
        request: {
          method: 'GET',
          path: '/api/test',
          query: { test: 'value' },
        },
        response: {
          statusCode: 200,
          responseBody: { success: true },
          responseTime: '2024-01-01T10:00:00Z',
        },
        user: {
          userId: 'user-1',
        },
        timestamp: '2024-01-01T10:00:00Z',
      },
    ]

    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(screen.getByTestId('data-length')).toHaveTextContent('1')
  })

  it('should merge query parameters correctly', async () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    mockApiLogFields.mockImplementation(({ onSubmit }) => (
      <div data-testid="api-log-fields">
        <button onClick={() => onSubmit({
          startDate: '2024-01-01T10:00:00Z',
          endDate: '2024-01-01T11:00:00Z',
          operator: 'test-operator',
          endpoint: '/api/test',
        })}>Submit With Params</button>
      </div>
    ))

    // Act
    render(<ApiLog />)
    fireEvent.click(screen.getByText('Submit With Params'))

    // Assert
    await waitFor(() => {
      expect(mockUseApiLog).toHaveBeenCalledWith({
        startDate: '2024-01-01T10:00:00Z',
        endDate: '2024-01-01T11:00:00Z',
        operator: 'test-operator',
        endpoint: '/api/test',
      })
    })
  })

  it('should initialize with default date range', () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(mockUseApiLog).toHaveBeenCalledWith({
      startDate: expect.any(String),
      endDate: expect.any(String),
    })

    // Verify the dates are approximately 1 hour apart
    const callArgs = mockUseApiLog.mock.calls[0][0]
    const startDate = new Date(callArgs.startDate)
    const endDate = new Date(callArgs.endDate)
    const timeDiff = endDate.getTime() - startDate.getTime()
    expect(timeDiff).toBeCloseTo(1000 * 60 * 60, -2) // Within 100ms of 1 hour
  })

  it('should handle form submission with /api/events endpoint and game/event IDs', async () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    mockApiLogFields.mockImplementation(({ onSubmit }) => (
      <div data-testid="api-log-fields">
        <button onClick={() => onSubmit({
          startDate: '2024-01-01T10:00:00Z',
          endDate: '2024-01-01T11:00:00Z',
          endpoint: '/api/events',
          gameId: '123',
          eventId: '456',
        })}>Submit Events</button>
      </div>
    ))

    // Act
    render(<ApiLog />)
    fireEvent.click(screen.getByText('Submit Events'))

    // Assert
    await waitFor(() => {
      expect(mockUseApiLog).toHaveBeenCalledWith({
        startDate: '2024-01-01T10:00:00Z',
        endDate: '2024-01-01T11:00:00Z',
        endpoint: '/api/events',
        gameId: '123',
        eventId: '456',
      })
    })

    expect(screen.getByTestId('api-query-endpoint')).toHaveTextContent('/api/events')
    expect(screen.getByTestId('api-query-game-id')).toHaveTextContent('123')
    expect(screen.getByTestId('api-query-event-id')).toHaveTextContent('456')
  })

  it('should pass correct apiQuery to ApiLogTable with event endpoint', () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = []
    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(capturedApiQuery).toEqual({
      startDate: expect.any(String),
      endDate: expect.any(String),
    })
    expect(mockApiLogTable).toHaveBeenCalledWith(
      expect.objectContaining({
        apiQuery: capturedApiQuery,
        data: mockApiLogs,
        isLoading: false,
        isError: false,
      }),
      undefined
    )
  })

  it('should handle data with event logs containing additional info', () => {
    // Arrange
    const mockApiLogs: ApiLogResponseItem[] = [
      {
        id: '1',
        request: {
          method: 'GET',
          path: '/api/events',
          query: { eventId: '123' },
          additionalInfo: {
            eventId: 123,
            gameId: 456,
          },
        },
        response: {
          statusCode: 200,
          responseBody: { success: true },
          responseTime: '2024-01-01T10:00:00Z',
        },
        user: {
          userId: 'user-1',
        },
        timestamp: '2024-01-01T10:00:00Z',
      },
    ]

    mockUseApiLog.mockReturnValue({
      data: { data: mockApiLogs } as AxiosResponse<ApiLogResponseItem[]>,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    })

    // Act
    render(<ApiLog />)

    // Assert
    expect(screen.getByTestId('data-length')).toHaveTextContent('1')
    expect(mockApiLogTable).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockApiLogs,
      }),
      undefined
    )
  })
}) 