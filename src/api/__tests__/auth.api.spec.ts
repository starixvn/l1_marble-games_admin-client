import { describe, it, expect, beforeEach, vi } from 'vitest'
import { login } from '../auth.api'
import { apiClient } from '../base.axios'

vi.mock('../base.axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe('Auth API', () => {
  const mockApiClient = apiClient as unknown as { post: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call login endpoint with correct credentials', async () => {
      // Arrange
      const credentials = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockResponse = {
        data: {
          access_token: 'mock-token-123',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'mock-token-123',
      })
    })

    it('should handle login with different credentials', async () => {
      // Arrange
      const credentials = {
        username: 'admin',
        password: 'admin123',
      }
      const mockResponse = {
        data: {
          access_token: 'admin-token-456',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'admin-token-456',
      })
    })

    it('should handle login API errors', async () => {
      // Arrange
      const credentials = {
        username: 'invalid',
        password: 'wrong',
      }
      const mockError = new Error('Invalid credentials')
      mockApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(login(credentials)).rejects.toThrow('Invalid credentials')
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
    })

    it('should handle network errors', async () => {
      // Arrange
      const credentials = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockError = new Error('Network error')
      mockApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(login(credentials)).rejects.toThrow('Network error')
    })

    it('should handle empty credentials', async () => {
      // Arrange
      const credentials = {
        username: '',
        password: '',
      }
      const mockResponse = {
        data: {
          access_token: 'empty-token',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'empty-token',
      })
    })

    it('should handle special characters in credentials', async () => {
      // Arrange
      const credentials = {
        username: 'user@domain.com',
        password: 'pass!@#$%^&*()',
      }
      const mockResponse = {
        data: {
          access_token: 'special-token',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'special-token',
      })
    })

    it('should handle long credentials', async () => {
      // Arrange
      const credentials = {
        username: 'a'.repeat(100),
        password: 'b'.repeat(100),
      }
      const mockResponse = {
        data: {
          access_token: 'long-token',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'long-token',
      })
    })

    it('should handle malformed response', async () => {
      // Arrange
      const credentials = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockResponse = {
        data: {
          // Missing access_token
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({})
    })

    it('should handle response with additional fields', async () => {
      // Arrange
      const credentials = {
        username: 'testuser',
        password: 'testpass',
      }
      const mockResponse = {
        data: {
          access_token: 'mock-token-123',
          expires_in: 3600,
          token_type: 'Bearer',
        },
      }
      mockApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual({
        access_token: 'mock-token-123',
        expires_in: 3600,
        token_type: 'Bearer',
      })
    })
  })
})
