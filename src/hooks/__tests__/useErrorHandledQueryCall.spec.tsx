import { renderHook } from '@testing-library/react'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import { useContext } from 'react'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
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

import { useErrorHandledQueryCall } from '../useErrorHandledQueryCall'
import { isUnauthorizedError } from '@/shared/errors'
import { isLoginPage } from '@/shared/location'

describe('useErrorHandledQueryCall', () => {
  const mockUseQuery = vi.mocked(useQuery)
  const mockUseLocation = vi.mocked(useLocation)
  const mockUseContext = vi.mocked(useContext)
  const mockIsUnauthorizedError = vi.mocked(isUnauthorizedError)
  const mockIsLoginPage = vi.mocked(isLoginPage)
  const mockHandleLogout = vi.fn()
  const mockQueryResult: UseQueryResult<unknown, unknown> = {
    data: undefined,
    error: null,
    isError: false,
    isSuccess: false,
    isPending: true,
    status: 'pending',
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
    fetchStatus: 'idle',
    errorUpdateCount: 0,
    isLoading: true,
    isInitialLoading: true,
    promise: Promise.resolve(),
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
    mockUseQuery.mockReturnValue(mockQueryResult)
  })

  it('should call useQuery with wrapped options', () => {
    // Arrange
    const mockOptions = {
      queryKey: ['test'],
      queryFn: vi.fn(),
    }

    // Act
    renderHook(() => useErrorHandledQueryCall(mockOptions))

    // Assert
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockOptions,
        throwOnError: expect.any(Function),
        retry: expect.any(Function),
      }),
    )
  })

  it('should handle unauthorized error and logout when not on login page', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
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
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    throwOnError(mockError)

    // Assert
    expect(mockHandleLogout).toHaveBeenCalled()
  })

  it('should not logout when unauthorized error occurs on login page', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
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
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    throwOnError(mockError)

    // Assert
    expect(mockHandleLogout).not.toHaveBeenCalled()
  })

  it('should return false from throwOnError for unauthorized errors', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)
    mockIsLoginPage.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    const result = throwOnError(mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should return false from throwOnError for non-unauthorized errors', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
    const mockError = new Error('Other error')
    mockIsUnauthorizedError.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const throwOnError = wrappedOptions.throwOnError as (error: unknown) => boolean
    const result = throwOnError(mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should not retry unauthorized errors', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
    const mockError = new Error('Unauthorized')
    mockIsUnauthorizedError.mockReturnValue(true)

    // Act
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const retry = wrappedOptions.retry as (failureCount: number, error: unknown) => boolean
    const result = retry(1, mockError)

    // Assert
    expect(result).toBe(false)
  })

  it('should retry non-unauthorized errors up to 3 times', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }
    const mockError = new Error('Other error')
    mockIsUnauthorizedError.mockReturnValue(false)

    // Act
    renderHook(() => useErrorHandledQueryCall(mockOptions))
    const wrappedOptions = mockUseQuery.mock.calls[0][0]
    const retry = wrappedOptions.retry as (failureCount: number, error: unknown) => boolean
    const resultFirstAttempt = retry(0, mockError)
    const resultSecondAttempt = retry(1, mockError)
    const resultThirdAttempt = retry(2, mockError)
    const resultFourthAttempt = retry(3, mockError)

    // Assert
    expect(resultFirstAttempt).toBe(true)
    expect(resultSecondAttempt).toBe(true)
    expect(resultThirdAttempt).toBe(true)
    expect(resultFourthAttempt).toBe(false)
  })

  it('should return query result from useQuery', () => {
    // Arrange
    const mockOptions = { queryKey: ['test'], queryFn: vi.fn() }

    // Act
    const { result } = renderHook(() => useErrorHandledQueryCall(mockOptions))

    // Assert
    expect(result.current).toBe(mockQueryResult)
  })
})
