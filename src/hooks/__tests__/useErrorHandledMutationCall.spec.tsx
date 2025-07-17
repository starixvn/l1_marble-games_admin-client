import { renderHook } from '@testing-library/react'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import { useContext } from 'react'

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}))

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}))

vi.mock('@/contexts/auth.context', () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}))

vi.mock('react', () => ({
  useContext: vi.fn(),
}))

vi.mock('@/shared/errors', () => ({
  isUnauthorizedError: vi.fn(),
}))

vi.mock('@/shared/location', () => ({
  isLoginPage: vi.fn(),
}))

import { useErrorHandledMutationCall } from '../useErrorHandledMutationCall'
import { isUnauthorizedError } from '@/shared/errors'
import { isLoginPage } from '@/shared/location'

describe('useErrorHandledMutationCall', () => {
  const mockUseMutation = vi.mocked(useMutation)
  const mockUseLocation = vi.mocked(useLocation)
  const mockUseContext = vi.mocked(useContext)
  const mockIsUnauthorizedError = vi.mocked(isUnauthorizedError)
  const mockIsLoginPage = vi.mocked(isLoginPage)
  const mockHandleLogout = vi.fn()
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
    status: 'idle',
    failureCount: 0,
    failureReason: null,
    reset: vi.fn(),
    context: undefined,
    isPaused: false,
    submittedAt: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ 
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })
    mockUseContext.mockReturnValue({ handleLogout: mockHandleLogout })
    mockUseMutation.mockReturnValue(mockMutationResult)
  })

  it('should call useMutation with wrapped options', () => {
    // Arrange
    const mockOptions = {
      mutationFn: vi.fn(),
      onSuccess: vi.fn(),
    }

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))

    // Assert
    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockOptions,
        throwOnError: expect.any(Function),
        retry: expect.any(Function),
      }),
    )
  })

  it('should handle unauthorized error and logout when not on login page', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)
    mockIsLoginPage.mockReturnValue(false)
    mockUseLocation.mockReturnValue({ 
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    throwOnError(mockError)

    // Assert
    expect(mockHandleLogout).toHaveBeenCalled()
  })

  it('should not logout when unauthorized error occurs on login page', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)
    mockIsLoginPage.mockReturnValue(true)
    mockUseLocation.mockReturnValue({ 
      pathname: '/login',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    throwOnError(mockError)

    // Assert
    expect(mockHandleLogout).not.toHaveBeenCalled()
  })

  it('should return false from throwOnError for unauthorized errors', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)
    mockIsLoginPage.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    const result = throwOnError(mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false from throwOnError for non-unauthorized errors', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Other error')
    mockIsUnauthorizedError.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    const result = throwOnError(mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should not retry unauthorized errors', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const retry = wrappedOptions.retry as (failureCount: number, error: unknown) => boolean
    const result = retry(1, mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should retry non-unauthorized errors up to 1 time', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }
    const mockError = new Error('Other error')
    mockIsUnauthorizedError.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledMutationCall(mockOptions))
    const wrappedOptions = mockUseMutation.mock.calls[0][0]
    const retry = wrappedOptions.retry as (failureCount: number, error: unknown) => boolean
    const resultFirstAttempt = retry(0, mockError)
    const resultSecondAttempt = retry(1, mockError)

    // Assert
    expect(resultFirstAttempt).toBe(true)
    expect(resultSecondAttempt).toBe(false)
  })

  it('should return mutation result from useMutation', () => {
    // Arrange
    const mockOptions = { mutationFn: vi.fn() }

    // Act
    const { result } = renderHook(() => useErrorHandledMutationCall(mockOptions))

    // Assert
    expect(result.current).toBe(mockMutationResult)
  })
})
