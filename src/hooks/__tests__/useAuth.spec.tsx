import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/url', () => ({
  getApiUrl: vi.fn(() => 'http://localhost:3000/api'),
}))

vi.mock('@/api/auth.api', () => ({
  login: vi.fn(),
}))

vi.mock('@/api/private.axios', () => ({
  AUTH_TOKEN_KEY: 'auth_token',
  globalAuthEventEmitter: new EventTarget(),
}))

import { useAuth, type UserCredential } from '../useAuth'
import { login } from '@/api/auth.api'
import { AUTH_TOKEN_KEY, globalAuthEventEmitter } from '@/api/private.axios'

describe('useAuth', () => {
  const mockLogin = login as ReturnType<typeof vi.fn>
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
  })

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null)

      // Act
      const { result } = renderHook(() => useAuth())

      // Assert
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
    })

    it('should initialize with authenticated state when token exists in localStorage', () => {
      // Arrange
      const mockToken = 'existing-token'
      mockLocalStorage.getItem.mockReturnValue(mockToken)

      // Act
      const { result } = renderHook(() => useAuth())

      // Assert
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe(mockToken)
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY)
    })

    it('should handle localStorage error gracefully', () => {
      // Arrange
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      // Act
      const { result } = renderHook(() => useAuth())

      // Assert
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
    })
  })

  describe('handleLogin', () => {
    it('should successfully login and update auth state', async () => {
      // Arrange
      const mockCredentials: UserCredential = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockResponse = { access_token: 'new-token' }
      mockLogin.mockResolvedValue(mockResponse)
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useAuth())

      // Act
      await act(async () => {
        await result.current.handleLogin(mockCredentials)
      })

      // Assert
      expect(mockLogin).toHaveBeenCalledWith(mockCredentials)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY, 'new-token')
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe('new-token')
      expect(result.current.isLoading).toBe(false)
    })

    it('should throw error when login fails', async () => {
      // Arrange
      const mockCredentials: UserCredential = {
        username: 'testuser',
        password: 'wrongpass',
      }
      const mockError = new Error('Login failed')
      mockLogin.mockRejectedValue(mockError)
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useAuth())

      // Act & Assert
      await expect(
        act(async () => {
          await result.current.handleLogin(mockCredentials)
        }),
      ).rejects.toThrow('Login failed')

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
    })
  })

  describe('handleLogout', () => {
    it('should logout and clear auth state when token exists', () => {
      // Arrange
      const mockToken = 'existing-token'
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      const { result } = renderHook(() => useAuth())
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe(mockToken)

      // Act
      act(() => {
        result.current.handleLogout()
      })

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })

    it('should logout and clear auth state when no token exists', () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useAuth())

      // Act
      act(() => {
        result.current.handleLogout()
      })

      // Assert
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('updateAuthToken', () => {
    it('should update auth token and state', () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useAuth())
      const newToken = 'updated-token'

      // Act
      act(() => {
        result.current.updateAuthToken(newToken)
      })

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY, newToken)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe(newToken)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('global auth event listener', () => {
    it('should listen to global logout events', () => {
      // Arrange
      const mockToken = 'existing-token'
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      const { result } = renderHook(() => useAuth())
      expect(result.current.isAuthenticated).toBe(true)

      // Act
      act(() => {
        globalAuthEventEmitter.dispatchEvent(new Event('logout'))
      })

      // Assert
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY)
    })

    it('should clean up event listener on unmount', () => {
      // Arrange
      const removeEventListenerSpy = vi.spyOn(globalAuthEventEmitter, 'removeEventListener')
      const { unmount } = renderHook(() => useAuth())

      // Act
      unmount()

      // Assert
      expect(removeEventListenerSpy).toHaveBeenCalledWith('logout', expect.any(Function))
    })
  })

  describe('auth state consistency', () => {
    it('should maintain consistent state after multiple operations', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useAuth())
      const mockCredentials: UserCredential = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockResponse = { access_token: 'login-token' }
      mockLogin.mockResolvedValue(mockResponse)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)

      // Act
      await act(async () => {
        await result.current.handleLogin(mockCredentials)
      })

      // Assert
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe('login-token')

      // Act
      act(() => {
        result.current.updateAuthToken('updated-token')
      })

      // Assert
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe('updated-token')

      // Act
      act(() => {
        result.current.handleLogout()
      })

      // Assert
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
    })
  })

  describe('callback stability', () => {
    it('should maintain stable callback references', () => {
      // Arrange
      const { result, rerender } = renderHook(() => useAuth())
      const initialHandleLogin = result.current.handleLogin
      const initialHandleLogout = result.current.handleLogout
      const initialUpdateAuthToken = result.current.updateAuthToken

      // Act
      rerender()

      // Assert
      expect(result.current.handleLogin).toBe(initialHandleLogin)
      expect(result.current.handleLogout).toBe(initialHandleLogout)
      expect(result.current.updateAuthToken).toBe(initialUpdateAuthToken)
    })
  })
})
