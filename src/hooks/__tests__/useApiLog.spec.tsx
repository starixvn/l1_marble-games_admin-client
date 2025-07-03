import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApiLog } from '../useApiLog'
import type { ApiLogQuery, ApiLogResponseItem } from '@/api/api-log.api'

// Mock external dependencies
vi.mock('@/api/api-log.api', () => ({
  getApiLogs: vi.fn(),
}))

vi.mock('@/hooks/useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

// Import mocked functions
import { getApiLogs } from '@/api/api-log.api'
import { useErrorHandledQueryCall } from '@/hooks/useErrorHandledQueryCall'
import type { AxiosResponse } from 'axios'

const mockGetApiLogs = vi.mocked(getApiLogs)
const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)

// Type for mock query result
type MockQueryResult = {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  data: ApiLogResponseItem[] | undefined
  error: Error | null
}

// Type for mock options
type MockOptions = {
  queryKey: string[]
  queryFn: () => Promise<ApiLogResponseItem[]>
}

describe('useApiLog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call useErrorHandledQueryCall with correct parameters and return expected data', () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      operator: 'test-operator',
      endpoint: '/api/test',
      gameId: '123',
      eventId: '456',
    }

    const mockApiLogs: ApiLogResponseItem[] = [
      {
        id: '1',
        request: {
          method: 'GET',
          path: '/api/test',
          query: { test: 'value' },
          additionalInfo: {
            eventId: 456,
            gameId: 123,
            roundId: 1,
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

    const mockQueryResult: MockQueryResult = {
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockApiLogs,
      error: null,
    }

    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as ReturnType<typeof useErrorHandledQueryCall>)

    // Act
    const { result } = renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['apiLog', '2024-01-01', '2024-01-31', 'test-operator', '/api/test', '123', '456'],
      queryFn: expect.any(Function),
    })

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: mockApiLogs,
      error: null,
    })
  })

  it('should call getApiLogs when queryFn is executed', async () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    }

    const mockApiLogs: ApiLogResponseItem[] = []
    mockGetApiLogs.mockResolvedValue(mockApiLogs as unknown as AxiosResponse<ApiLogResponseItem[]>)

    let capturedQueryFn: (() => Promise<ApiLogResponseItem[]>) | undefined

    mockUseErrorHandledQueryCall.mockImplementation((options: unknown) => {
      const mockOptions = options as MockOptions
      capturedQueryFn = mockOptions.queryFn
      return {
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: mockApiLogs,
        error: null,
      } as ReturnType<typeof useErrorHandledQueryCall>
    })

    // Act
    renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(capturedQueryFn).toBeDefined()

    if (capturedQueryFn) {
      await capturedQueryFn()
      expect(mockGetApiLogs).toHaveBeenCalledWith(mockQuery)
    }
  })

  it('should handle loading state', () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    }

    const mockQueryResult = {
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    }

    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as ReturnType<typeof useErrorHandledQueryCall>)

    // Act
    const { result } = renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    }

    const mockError = new Error('API Error')
    const mockQueryResult = {
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
      error: mockError,
    }

    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as ReturnType<typeof useErrorHandledQueryCall>)

    // Act
    const { result } = renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBe(mockError)
  })

  it('should handle partial query parameters', () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      // Only required parameters, optional ones omitted
    }

    const mockQueryResult = {
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: [],
      error: null,
    }

    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as ReturnType<typeof useErrorHandledQueryCall>)

    // Act
    const { result } = renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['apiLog', '2024-01-01', '2024-01-31', undefined, undefined, undefined, undefined],
      queryFn: expect.any(Function),
    })

    expect(result.current).toEqual(mockQueryResult)
  })

  it('should generate unique query key based on all parameters', () => {
    // Arrange
    const mockQuery: ApiLogQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      operator: 'operator1',
      endpoint: '/api/events',
      gameId: '1001',
      eventId: '2001',
    }

    mockUseErrorHandledQueryCall.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: [],
      error: null,
    } as ReturnType<typeof useErrorHandledQueryCall>)

    // Act
    renderHook(() => useApiLog(mockQuery))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['apiLog', '2024-01-01', '2024-01-31', 'operator1', '/api/events', '1001', '2001'],
      queryFn: expect.any(Function),
    })
  })
})
