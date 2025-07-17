import { renderHook, act } from '@testing-library/react'
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'
import { upsertGameConfigSchema } from '@/api/game-config-schema.api'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('../useErrorHandledMutationCall', () => ({
  useErrorHandledMutationCall: vi.fn(),
}))

vi.mock('@/api/game-config-schema.api', () => ({
  getGameConfigSchema: vi.fn(),
  listGameConfigSchemas: vi.fn(),
  upsertGameConfigSchema: vi.fn(),
}))

import { 
  useGameConfigSchemaList, 
  useGameConfigSchemaWithId, 
  useGameConfigSchema, 
  useGameConfigSchemaUpsert 
} from '../useGameConfigSchema'

describe('useGameConfigSchema', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)
  const mockUseErrorHandledMutationCall = vi.mocked(useErrorHandledMutationCall)
  const mockUpsertGameConfigSchema = vi.mocked(upsertGameConfigSchema)

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

  describe('useGameConfigSchemaList', () => {
    it('should call useErrorHandledQueryCall with correct options', () => {
      // Arrange

      // Act
      renderHook(() => useGameConfigSchemaList())

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigSchemaList'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      })
    })

    it('should return gameConfigSchemaListQuery', () => {
      // Arrange

      // Act
      const { result } = renderHook(() => useGameConfigSchemaList())

      // Assert
      expect(result.current).toHaveProperty('gameConfigSchemaListQuery')
      expect(result.current.gameConfigSchemaListQuery).toBe(mockQueryResult)
    })
  })

  describe('useGameConfigSchemaWithId', () => {
    it('should call useErrorHandledQueryCall with id when provided', () => {
      // Arrange
      const id = 'test-schema-id'

      // Act
      renderHook(() => useGameConfigSchemaWithId({ id }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigSchemaGet', id],
        queryFn: expect.any(Function),
        enabled: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      })
    })

    it('should disable query when id is undefined', () => {
      // Arrange

      // Act
      renderHook(() => useGameConfigSchemaWithId({ id: undefined }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigSchemaGet', undefined],
        queryFn: expect.any(Function),
        enabled: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      })
    })

    it('should return gameConfigSchemaGetQuery', () => {
      // Arrange
      const id = 'test-schema-id'

      // Act
      const { result } = renderHook(() => useGameConfigSchemaWithId({ id }))

      // Assert
      expect(result.current).toHaveProperty('gameConfigSchemaGetQuery')
      expect(result.current.gameConfigSchemaGetQuery).toBe(mockQueryResult)
    })
  })

  describe('useGameConfigSchema', () => {
    it('should initialize with provided id', () => {
      // Arrange
      const id = 'initial-schema-id'
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      // Act
      const { result } = renderHook(() => useGameConfigSchema({ id }))

      // Assert
      expect(result.current.currentSchemaId).toBe(id)
    })

    it('should initialize with null when no id provided', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      // Act
      const { result } = renderHook(() => useGameConfigSchema({}))

      // Assert
      expect(result.current.currentSchemaId).toBe(null)
    })

    it('should call useErrorHandledQueryCall for schema list', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      // Act
      renderHook(() => useGameConfigSchema({}))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigSchemaList'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      })
    })

    it('should call useErrorHandledQueryCall for schema with current id', () => {
      // Arrange
      const id = 'test-schema-id'
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      // Act
      renderHook(() => useGameConfigSchema({ id }))

      // Assert
      expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
        queryKey: ['gameConfigSchemaGet', id],
        queryFn: expect.any(Function),
        enabled: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      })
    })

    it('should update currentSchemaId when setCurrentSchemaId is called', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      const { result } = renderHook(() => useGameConfigSchema({}))

      // Act
      act(() => {
        result.current.setCurrentSchemaId('new-schema-id')
      })

      // Assert
      expect(result.current.currentSchemaId).toBe('new-schema-id')
    })

    it('should return all expected properties', () => {
      // Arrange
      mockUseErrorHandledQueryCall
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaListQuery
        .mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>) // gameConfigSchemaGetQuery

      // Act
      const { result } = renderHook(() => useGameConfigSchema({}))

      // Assert
      expect(result.current).toHaveProperty('gameConfigSchemaListQuery')
      expect(result.current).toHaveProperty('currentSchemaId')
      expect(result.current).toHaveProperty('setCurrentSchemaId')
      expect(result.current).toHaveProperty('gameConfigSchemaGetQuery')
    })
  })

  describe('useGameConfigSchemaUpsert', () => {
    it('should call useErrorHandledMutationCall with upsert function', () => {
      // Arrange

      // Act
      renderHook(() => useGameConfigSchemaUpsert())

      // Assert
      expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
        mutationFn: mockUpsertGameConfigSchema,
      })
    })

    it('should return gameConfigSchemaUpsertMutation', () => {
      // Arrange

      // Act
      const { result } = renderHook(() => useGameConfigSchemaUpsert())

      // Assert
      expect(result.current).toHaveProperty('gameConfigSchemaUpsertMutation')
      expect(result.current.gameConfigSchemaUpsertMutation).toBe(mockMutationResult)
    })
  })
})
