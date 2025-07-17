import { renderHook } from '@testing-library/react'
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'
import { createOperator, updateOperatorName, generatePassword } from '@/api/operator.api'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn(),
}))

vi.mock('../useErrorHandledMutationCall', () => ({
  useErrorHandledMutationCall: vi.fn(),
}))

vi.mock('@/api/operator.api', () => ({
  createOperator: vi.fn(),
  listOperators: vi.fn(),
  updateOperatorName: vi.fn(),
  generatePassword: vi.fn(),
}))

import { useOperator } from '../useOperator'

describe('useOperator', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)
  const mockUseErrorHandledMutationCall = vi.mocked(useErrorHandledMutationCall)
  const mockCreateOperator = vi.mocked(createOperator)
  const mockUpdateOperatorName = vi.mocked(updateOperatorName)
  const mockGeneratePassword = vi.mocked(generatePassword)

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

  it('should call useErrorHandledQueryCall for operators', () => {
    // Arrange

    // Act
    renderHook(() => useOperator())

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['operators'],
      queryFn: expect.any(Function),
    })
  })

  it('should call useErrorHandledMutationCall for createOperator with refetch on success', () => {
    // Arrange
    mockUseErrorHandledQueryCall.mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

    // Act
    renderHook(() => useOperator())

    // Assert
    expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
      mutationFn: mockCreateOperator,
      onSuccess: expect.any(Function),
    })
  })

  it('should call useErrorHandledMutationCall for updateOperatorName with refetch on success', () => {
    // Arrange
    mockUseErrorHandledQueryCall.mockReturnValueOnce(mockQueryResult as unknown as UseQueryResult<unknown, unknown>)

    // Act
    renderHook(() => useOperator())

    // Assert
    expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
      mutationFn: mockUpdateOperatorName,
      onSuccess: expect.any(Function),
    })
  })

  it('should call useErrorHandledMutationCall for generatePassword', () => {
    // Arrange

    // Act
    renderHook(() => useOperator())

    // Assert
    expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
      mutationFn: mockGeneratePassword,
    })
  })

  it('should call refetch when createOperator mutation succeeds', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseErrorHandledQueryCall.mockReturnValueOnce({ ...mockQueryResult, refetch: mockRefetch } as unknown as UseQueryResult<unknown, unknown>)

    // Act
    renderHook(() => useOperator())
    const createMutationOptions = mockUseErrorHandledMutationCall.mock.calls[0][0] as { onSuccess: () => void }
    createMutationOptions.onSuccess()

    // Assert
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should call refetch when updateOperatorName mutation succeeds', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseErrorHandledQueryCall.mockReturnValueOnce({ ...mockQueryResult, refetch: mockRefetch } as unknown as UseQueryResult<unknown, unknown>)

    // Act
    renderHook(() => useOperator())
    const updateMutationOptions = mockUseErrorHandledMutationCall.mock.calls[1][0] as { onSuccess: () => void }
    updateMutationOptions.onSuccess()

    // Assert
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should return all expected properties', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useOperator())

    // Assert
    expect(result.current).toHaveProperty('operatorsQuery')
    expect(result.current).toHaveProperty('createOperatorMutation')
    expect(result.current).toHaveProperty('updateOperatorNameMutation')
    expect(result.current).toHaveProperty('generatePasswordMutation')
  })
})
