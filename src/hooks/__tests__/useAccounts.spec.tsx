import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAccounts, useCreateAccount } from '../useAccounts'
import { createAccount, getAllAccounts, Role } from '@/api/auth.api'

// Mock the dependency hooks
vi.mock('../useErrorHandledQueryCall', () => ({
  useErrorHandledQueryCall: vi.fn()
}))

vi.mock('../useErrorHandledMutationCall', () => ({
  useErrorHandledMutationCall: vi.fn()
}))

// Mock the API functions
vi.mock('@/api/auth.api', () => ({
  getAllAccounts: vi.fn(),
  createAccount: vi.fn(),
  Role: {
    ADMIN: 'admin',
    DEVELOPER: 'developer',
    READONLY: 'readonly'
  }
}))

// Import the mocked hooks
import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'

// Define the return types based on what the hooks actually return
type UseAccountsReturn = ReturnType<typeof useAccounts>
type UseCreateAccountReturn = ReturnType<typeof useCreateAccount>

describe('useAccounts', () => {
  const mockUseErrorHandledQueryCall = vi.mocked(useErrorHandledQueryCall)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call useErrorHandledQueryCall with correct parameters', () => {
    // Arrange
    const mockReturnValue: UseAccountsReturn = {
      data: [],
      isLoading: false,
      error: null
    }
    ;(mockUseErrorHandledQueryCall as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockReturnValue)

    // Act
    const { result } = renderHook(() => useAccounts())

    // Assert
    expect(mockUseErrorHandledQueryCall).toHaveBeenCalledWith({
      queryKey: ['accounts'],
      queryFn: getAllAccounts
    })
    expect(result.current).toEqual(mockReturnValue)
  })

  it('should return the correct data structure', () => {
    // Arrange
    const mockReturnValue: UseAccountsReturn = {
      data: [{ username: 'testuser', role: Role.ADMIN }],
      isLoading: true,
      error: new Error('Test error')
    }
    ;(mockUseErrorHandledQueryCall as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockReturnValue)

    // Act
    const { result } = renderHook(() => useAccounts())

    // Assert
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toEqual(mockReturnValue)
  })
})

describe('useCreateAccount', () => {
  const mockUseErrorHandledMutationCall = vi.mocked(useErrorHandledMutationCall)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call useErrorHandledMutationCall with correct parameters', () => {
    // Arrange
    const mockReturnValue: UseCreateAccountReturn = {
      mutate: vi.fn(),
      isPending: false,
      reset: vi.fn(),
      data: undefined
    }
    ;(mockUseErrorHandledMutationCall as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockReturnValue)

    // Act
    const { result } = renderHook(() => useCreateAccount())

    // Assert
    expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
      mutationFn: createAccount
    })
    expect(result.current).toEqual(mockReturnValue)
  })

  it('should return the correct data structure', () => {
    // Arrange
    const mockReturnValue: UseCreateAccountReturn = {
      mutate: vi.fn(),
      isPending: true,
      reset: vi.fn(),
      data: { username: 'newuser', password: 'newpass' }
    }
    ;(mockUseErrorHandledMutationCall as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockReturnValue)

    // Act
    const { result } = renderHook(() => useCreateAccount())

    // Assert
    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('reset')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toEqual(mockReturnValue)
  })
})
