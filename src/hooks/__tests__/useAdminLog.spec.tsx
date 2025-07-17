import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/hooks/useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('@/api/admin-log.api', () => ({
  getAdminLogs: vi.fn(),
}))

import { useAdminLog } from '../useAdminLog'
import { useErrorHandledQueryCall } from '@/hooks/useErrorHandledQueryCall'
import { getAdminLogs } from '@/api/admin-log.api'

describe('useAdminLog', () => {
  const mockUseErrorHandledQueryCall = useErrorHandledQueryCall as ReturnType<typeof vi.fn>
  const mockGetAdminLogs = getAdminLogs as ReturnType<typeof vi.fn>

  const mockQueryParams = {
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-01-01T01:00:00.000Z',
    author: 'admin',
    resource: 'operator',
    action: 'insert',
  }

  const mockQueryResult = {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      data: [
        {
          id: '1',
          author: 'admin',
          resource: 'operator',
          action: 'insert',
          timestamp: '2024-01-01T00:00:00.000Z',
          diff: {
            old: { name: 'old value' },
            new: { name: 'new value' }
          }
        }
      ]
    },
    error: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult)
  })

  it('should call useErrorHandledQueryCall with correct query key', () => {
    // Arrange
    // Act
    renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['adminLog', mockQueryParams.startDate, mockQueryParams.endDate, mockQueryParams.author, mockQueryParams.resource, mockQueryParams.action],
      queryFn: expect.any(Function),
    })
  })

  it('should call useErrorHandledQueryCall with correct query function', () => {
    // Arrange
    // Act
    renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    const callArgs = mockUseErrorHandledQueryCall.mock.calls[0][0]
    expect(callArgs.queryFn).toBeInstanceOf(Function)
  })

  it('should call getAdminLogs with correct parameters when query function is executed', () => {
    // Arrange
    // Act
    renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    const callArgs = mockUseErrorHandledQueryCall.mock.calls[0][0]
    callArgs.queryFn()

    expect(mockGetAdminLogs).toHaveBeenCalledWith(mockQueryParams)
  })

  it('should return the result from useErrorHandledQueryCall', () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    expect(result.current).toEqual(mockQueryResult)
  })

  it('should handle query parameters with undefined optional values', () => {
    // Arrange
    const paramsWithUndefined = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T01:00:00.000Z',
      author: undefined,
      resource: undefined,
      action: undefined,
    }

    // Act
    renderHook(() => useAdminLog(paramsWithUndefined))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['adminLog', paramsWithUndefined.startDate, paramsWithUndefined.endDate, undefined, undefined, undefined],
      queryFn: expect.any(Function),
    })
  })

  it('should handle query parameters with only required values', () => {
    // Arrange
    const requiredOnlyParams = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T01:00:00.000Z',
    }

    // Act
    renderHook(() => useAdminLog(requiredOnlyParams))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['adminLog', requiredOnlyParams.startDate, requiredOnlyParams.endDate, undefined, undefined, undefined],
      queryFn: expect.any(Function),
    })
  })

  it('should handle loading state', () => {
    // Arrange
    const loadingResult = {
      ...mockQueryResult,
      isLoading: true,
      isSuccess: false,
    }
    mockUseErrorHandledQueryCall.mockReturnValue(loadingResult)

    // Act
    const { result } = renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isSuccess).toBe(false)
  })

  it('should handle error state', () => {
    // Arrange
    const errorResult = {
      ...mockQueryResult,
      isError: true,
      isSuccess: false,
      error: new Error('API Error'),
    }
    mockUseErrorHandledQueryCall.mockReturnValue(errorResult)

    // Act
    const { result } = renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    expect(result.current.isError).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should handle success state with data', () => {
    // Arrange
    const successResult = {
      ...mockQueryResult,
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {
        data: [
          {
            id: '1',
            author: 'admin',
            resource: 'operator',
            action: 'insert',
            timestamp: '2024-01-01T00:00:00.000Z',
          }
        ]
      },
    }
    mockUseErrorHandledQueryCall.mockReturnValue(successResult)

    // Act
    const { result } = renderHook(() => useAdminLog(mockQueryParams))

    // Assert
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toEqual(successResult.data)
  })

  it('should generate unique query key for different parameters', () => {
    // Arrange
    const params1 = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T01:00:00.000Z',
      author: 'admin',
      resource: 'operator',
      action: 'insert',
    }

    const params2 = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T01:00:00.000Z',
      author: 'user',
      resource: 'game-config',
      action: 'update',
    }

    // Act
    renderHook(() => useAdminLog(params1))
    renderHook(() => useAdminLog(params2))

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledTimes(2)
    
    const firstCall = mockUseErrorHandledQueryCall.mock.calls[0][0]
    const secondCall = mockUseErrorHandledQueryCall.mock.calls[1][0]
    
    expect(firstCall.queryKey).toEqual(['adminLog', params1.startDate, params1.endDate, params1.author, params1.resource, params1.action])
    expect(secondCall.queryKey).toEqual(['adminLog', params2.startDate, params2.endDate, params2.author, params2.resource, params2.action])
  })

  it('should call getAdminLogs with correct parameters for different query executions', () => {
    // Arrange
    const params1 = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-01T01:00:00.000Z',
      author: 'admin',
    }

    const params2 = {
      startDate: '2024-01-02T00:00:00.000Z',
      endDate: '2024-01-02T01:00:00.000Z',
      resource: 'game-config',
    }

    // Act
    renderHook(() => useAdminLog(params1))
    renderHook(() => useAdminLog(params2))

    // Execute query functions
    const callArgs1 = mockUseErrorHandledQueryCall.mock.calls[0][0]
    const callArgs2 = mockUseErrorHandledQueryCall.mock.calls[1][0]
    callArgs1.queryFn()
    callArgs2.queryFn()

    // Assert
    expect(mockGetAdminLogs).toHaveBeenCalledWith(params1)
    expect(mockGetAdminLogs).toHaveBeenCalledWith(params2)
  })
})
