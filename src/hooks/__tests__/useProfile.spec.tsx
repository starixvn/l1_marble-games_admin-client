import { renderHook } from '@testing-library/react'
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { getProfile } from '@/api/auth.api'

vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('@/api/auth.api', () => ({
  getProfile: vi.fn(),
}))

vi.mock('@/api/private.axios', () => ({
  globalAuthEventEmitter: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
}))

import { useProfile } from '../useProfile'
import { globalAuthEventEmitter } from '@/api/private.axios'
import type { UseQueryResult } from '@tanstack/react-query'

describe('useProfile', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)
  const mockGlobalAuthEventEmitter = vi.mocked(globalAuthEventEmitter)

  const mockQueryResult = {
    data: undefined,
    error: null,
    isError: false,
    isSuccess: true,
    isPending: false,
    status: 'success' as const,
    failureCount: 0,
    failureReason: null,
    refetch: vi.fn(),
    isFetching: false,
    isRefetching: false,
    isStale: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    isPlaceholderData: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isLoadingError: false,
    isPaused: false,
    isRefetchError: false,
    fetchStatus: 'idle' as const,
    errorUpdateCount: 0,
    isLoading: false,
    isInitialLoading: false,
    promise: Promise.resolve(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
  })

  describe('hook initialization', () => {
    it('should call useErrorHandledQueryCall with correct parameters', () => {
      // Arrange

      // Act
      renderHook(() => useProfile())

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['profile'],
        queryFn: getProfile,
      })
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledTimes(1)
    })

    it('should return the result from useErrorHandledQueryCall', () => {
      // Arrange
      const mockData = { username: 'testuser', role: 'admin', allowedEndpoints: ['/api/test'] }
      const queryResult = { ...mockQueryResult, data: mockData }
      mockUseErrorHandledQueryCall.mockReturnValue(queryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      const { result } = renderHook(() => useProfile())

      // Assert
      expect(result.current).toEqual({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null
      })
    })
  })

  describe('event listener management', () => {
    it('should add logout event listener on mount', () => {
      // Arrange

      // Act
      renderHook(() => useProfile())

      // Assert
      expect(mockGlobalAuthEventEmitter.addEventListener).toHaveBeenCalledWith('logout', expect.any(Function))
      expect(mockGlobalAuthEventEmitter.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('should remove logout event listener on unmount', () => {
      // Arrange

      // Act
      const { unmount } = renderHook(() => useProfile())
      unmount()

      // Assert
      expect(mockGlobalAuthEventEmitter.removeEventListener).toHaveBeenCalledWith('logout', expect.any(Function))
      expect(mockGlobalAuthEventEmitter.removeEventListener).toHaveBeenCalledTimes(1)
    })
  })
})
