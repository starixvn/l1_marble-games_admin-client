import { renderHook } from '@testing-library/react'
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'
import { upsertGameIntegration, deleteGameIntegration } from '@/api/game-integration.api'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('../useErrorHandledMutationCall', () => ({
  useErrorHandledMutationCall: vi.fn(),
}))

vi.mock('@/api/game-integration.api', () => ({
  getGameIntegration: vi.fn(),
  listGameIntegration: vi.fn(),
  upsertGameIntegration: vi.fn(),
  deleteGameIntegration: vi.fn(),
}))

import {
  useGameIntegrationList,
  useGameIntegrationWithId,
  useGameIntegrationUpsert,
  useGameIntegrationDelete,
} from '../useGameIntegration'

describe('useGameIntegration', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)
  const mockUseErrorHandledMutationCall = vi.mocked(useErrorHandledMutationCall)
  const mockUpsertGameIntegration = vi.mocked(upsertGameIntegration)
  const mockDeleteGameIntegration = vi.mocked(deleteGameIntegration)

  const mockQueryResult: UseQueryResult<unknown, unknown> = {
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

  const mockMutationResult: UseMutationResult<unknown, unknown, unknown, unknown> = {
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

  describe('useGameIntegrationList', () => {
    it('should call useErrorHandledQueryCall with correct options', () => {
      // Arrange

      // Act
      renderHook(() => useGameIntegrationList())

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameIntegrations'],
        queryFn: expect.any(Function),
      })
    })

    it('should return gameIntegrationListQuery', () => {
      // Arrange

      // Act
      const { result } = renderHook(() => useGameIntegrationList())

      // Assert
      expect(result.current).toHaveProperty('gameIntegrationListQuery')
      expect(result.current.gameIntegrationListQuery).toBe(mockQueryResult)
    })
  })

  describe('useGameIntegrationWithId', () => {
    it('should call useErrorHandledQueryCall with correct options', () => {
      // Arrange
      const gameId = 1
      const operatorId = 'op-123'
      const listExisting = true

      // Act
      renderHook(() => useGameIntegrationWithId({ gameId, operatorId, listExisting }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameIntegration', gameId, operatorId],
        queryFn: expect.any(Function),
        retry: false,
        enabled: true,
      })
    })

    it('should disable query when listExisting is false', () => {
      // Arrange
      const gameId = 1
      const operatorId = 'op-123'
      const listExisting = false

      // Act
      renderHook(() => useGameIntegrationWithId({ gameId, operatorId, listExisting }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameIntegration', gameId, operatorId],
        queryFn: expect.any(Function),
        retry: false,
        enabled: false,
      })
    })

    it('should disable query when gameId or operatorId is falsy', () => {
      // Arrange
      const operatorId = 'op-123'
      const listExisting = true

      // Act
      renderHook(() => useGameIntegrationWithId({ gameId: 0, operatorId, listExisting }))
      renderHook(() => useGameIntegrationWithId({ gameId: 1, operatorId: '', listExisting }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameIntegration', 0, operatorId],
        queryFn: expect.any(Function),
        retry: false,
        enabled: false,
      })
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameIntegration', 1, ''],
        queryFn: expect.any(Function),
        retry: false,
        enabled: false,
      })
    })

    it('should return gameIntegrationWithIdQuery', () => {
      // Arrange
      const gameId = 1
      const operatorId = 'op-123'
      const listExisting = true

      // Act
      const { result } = renderHook(() => useGameIntegrationWithId({ gameId, operatorId, listExisting }))

      // Assert
      expect(result.current).toHaveProperty('gameIntegrationWithIdQuery')
      expect(result.current.gameIntegrationWithIdQuery).toBe(mockQueryResult)
    })
  })

  describe('useGameIntegrationUpsert', () => {
    it('should call useErrorHandledMutationCall with upsert function', () => {
      // Arrange

      // Act
      renderHook(() => useGameIntegrationUpsert())

      // Assert
      expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
        mutationFn: mockUpsertGameIntegration,
      })
    })

    it('should return gameIntegrationUpsertMutation', () => {
      // Arrange

      // Act
      const { result } = renderHook(() => useGameIntegrationUpsert())

      // Assert
      expect(result.current).toHaveProperty('gameIntegrationUpsertMutation')
      expect(result.current.gameIntegrationUpsertMutation).toBe(mockMutationResult)
    })
  })

  describe('useGameIntegrationDelete', () => {
    it('should call useErrorHandledMutationCall with delete function', () => {
      // Arrange

      // Act
      renderHook(() => useGameIntegrationDelete())

      // Assert
      expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
        mutationFn: mockDeleteGameIntegration,
      })
    })

    it('should return gameIntegrationDeleteMutation', () => {
      // Arrange

      // Act
      const { result } = renderHook(() => useGameIntegrationDelete())

      // Assert
      expect(result.current).toHaveProperty('gameIntegrationDeleteMutation')
      expect(result.current.gameIntegrationDeleteMutation).toBe(mockMutationResult)
    })
  })
})
