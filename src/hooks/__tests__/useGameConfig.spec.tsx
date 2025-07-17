import { renderHook, act } from '@testing-library/react'
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'
import { upsertGameConfig } from '@/api/game-config.api'

vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('../useErrorHandledMutationCall', () => ({
  useErrorHandledMutationCall: vi.fn(),
}))

vi.mock('@/api/game-config.api', () => ({
  upsertGameConfig: vi.fn(),
  listGameConfigs: vi.fn(),
  getGameConfig: vi.fn(),
}))

import { useGameConfig, useGameConfigWithId } from '../useGameConfig'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

describe('useGameConfig', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)
  const mockUseErrorHandledMutationCall = vi.mocked(useErrorHandledMutationCall)
  const mockUpsertGameConfig = vi.mocked(upsertGameConfig)

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

  const mockMutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isError: false,
    isSuccess: false,
    isIdle: true,
    isPending: false,
    data: undefined,
    error: null,
    variables: undefined,
    status: 'idle' as const,
    failureCount: 0,
    failureReason: null,
    reset: vi.fn(),
    context: undefined,
    isPaused: false,
    submittedAt: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseErrorHandledQueryCall.mockReturnValue(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
    mockUseErrorHandledMutationCall.mockReturnValue(mockMutationResult as unknown as UseMutationResult<unknown, unknown, unknown, unknown>)
  })

  describe('useGameConfig', () => {
    it('should initialize with null currentGameId', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      const { result } = renderHook(() => useGameConfig())

      // Assert
      expect(result.current.currentGameId).toBe(null)
    })

    it('should call useErrorHandledQueryCall for gameConfigs list', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      renderHook(() => useGameConfig())

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigs'],
        queryFn: expect.any(Function),
      })
    })

    it('should call useErrorHandledMutationCall for upsert with refetch on success', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      renderHook(() => useGameConfig())

      // Assert
      expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
        mutationFn: mockUpsertGameConfig,
        onSuccess: expect.any(Function),
      })
    })

    it('should call refetch when upsert mutation succeeds', () => {
      // Arrange
      const mockRefetch = vi.fn()
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce({ ...mockQueryResult, refetch: mockRefetch } as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      renderHook(() => useGameConfig())
      const mutationOptions = mockUseErrorHandledMutationCall.mock.calls[0][0] as { onSuccess: () => void }
      mutationOptions.onSuccess()

      // Assert
      expect(mockRefetch).toHaveBeenCalled()
    })

    it('should call useErrorHandledQueryCall for gameConfig with ID when currentGameId is set', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      renderHook(() => useGameConfig())

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfig', null],
        queryFn: expect.any(Function),
        enabled: false,
      })
    })

    it('should enable gameConfigWithIdQuery when currentGameId is set', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      const { result } = renderHook(() => useGameConfig())

      // Act
      act(() => {
        result.current.setCurrentGameId(123)
      })

      // Assert
      expect(result.current.currentGameId).toBe(123)
    })

    it('should return all expected properties', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

      // Act
      const { result } = renderHook(() => useGameConfig())

      // Assert
      expect(result.current).toHaveProperty('gameConfigQuery')
      expect(result.current).toHaveProperty('gameConfigUpsertMutation')
      expect(result.current).toHaveProperty('currentGameId')
      expect(result.current).toHaveProperty('setCurrentGameId')
      expect(result.current).toHaveProperty('gameConfigWithIdQuery')
    })
  })

  describe('useGameConfigWithId', () => {
    it('should call useErrorHandledQueryCall with provided gameId', () => {
      // Arrange
      const gameId = 456

      // Act
      renderHook(() => useGameConfigWithId({ gameId }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfig', gameId],
        queryFn: expect.any(Function),
      })
    })

    it('should return gameConfigWithIdQuery', () => {
      // Arrange
      const gameId = 456

      // Act
      const { result } = renderHook(() => useGameConfigWithId({ gameId }))

      // Assert
      expect(result.current).toHaveProperty('gameConfigWithIdQuery')
      expect(result.current.gameConfigWithIdQuery).toBe(mockQueryResult)
    })
  })
})
