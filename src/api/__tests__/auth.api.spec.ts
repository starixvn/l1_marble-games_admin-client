import { describe, it, expect, beforeEach, vi } from 'vitest'
import { login, getProfile, changePassword, getAllAccounts, createAccount, Role } from '../auth.api'
import { apiClient } from '../base.axios'
import { privateApiClient } from '../private.axios'

vi.mock('../base.axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

vi.mock('../private.axios', () => ({
  privateApiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('Auth API', () => {
  const mockApiClient = apiClient as unknown as { post: ReturnType<typeof vi.fn> }
  const mockPrivateApiClient = privateApiClient as unknown as { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> }

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

  describe('getProfile', () => {
    it('should call get profile endpoint successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          role: 'admin',
          allowedEndpoints: ['/api/games', '/api/operators'],
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getProfile()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual({
        username: 'testuser',
        role: 'admin',
        allowedEndpoints: ['/api/games', '/api/operators'],
      })
    })

    it('should handle profile without role', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          allowedEndpoints: ['/api/games'],
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getProfile()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual({
        username: 'testuser',
        allowedEndpoints: ['/api/games'],
      })
    })

    it('should handle profile with empty allowed endpoints', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          role: 'user',
          allowedEndpoints: [],
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getProfile()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual({
        username: 'testuser',
        role: 'user',
        allowedEndpoints: [],
      })
    })

    it('should handle profile API errors', async () => {
      // Arrange
      const mockError = new Error('Unauthorized')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getProfile()).rejects.toThrow('Unauthorized')
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
    })

    it('should handle network errors', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getProfile()).rejects.toThrow('Network error')
    })

    it('should handle malformed response', async () => {
      // Arrange
      const mockResponse = {
        data: {
          // Missing required fields
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getProfile()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual({})
    })

    it('should handle response with additional fields', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          role: 'admin',
          allowedEndpoints: ['/api/games'],
          email: 'test@example.com',
          lastLogin: '2024-01-01T00:00:00Z',
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getProfile()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/profile')
      expect(result).toEqual({
        username: 'testuser',
        role: 'admin',
        allowedEndpoints: ['/api/games'],
        email: 'test@example.com',
        lastLogin: '2024-01-01T00:00:00Z',
      })
    })
  })

  describe('changePassword', () => {
    it('should call change password endpoint with correct URL', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          password: 'newpassword123',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      await changePassword()

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/changePassword')
    })

    it('should return user credentials from change password response', async () => {
      // Arrange
      const mockResponse = {
        data: {
          username: 'testuser',
          password: 'newpassword123',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await changePassword()

      // Assert
      expect(result).toEqual({
        username: 'testuser',
        password: 'newpassword123',
      })
    })

    it('should handle change password API errors', async () => {
      // Arrange
      const mockError = new Error('Password change failed')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(changePassword()).rejects.toThrow('Password change failed')
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/changePassword')
    })
  })

  describe('getAllAccounts', () => {
    it('should call get all accounts endpoint successfully', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            username: 'admin1',
            role: Role.ADMIN,
          },
          {
            username: 'developer1',
            role: Role.DEVELOPER,
          },
          {
            username: 'readonly1',
            role: Role.READONLY,
          },
        ],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getAllAccounts()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
      expect(result).toEqual([
        {
          username: 'admin1',
          role: Role.ADMIN,
        },
        {
          username: 'developer1',
          role: Role.DEVELOPER,
        },
        {
          username: 'readonly1',
          role: Role.READONLY,
        },
      ])
    })

    it('should handle accounts without roles', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            username: 'user1',
          },
          {
            username: 'user2',
          },
        ],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getAllAccounts()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
      expect(result).toEqual([
        {
          username: 'user1',
        },
        {
          username: 'user2',
        },
      ])
    })

    it('should handle empty accounts list', async () => {
      // Arrange
      const mockResponse = {
        data: [],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getAllAccounts()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
      expect(result).toEqual([])
    })

    it('should handle getAllAccounts API errors', async () => {
      // Arrange
      const mockError = new Error('Unauthorized')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getAllAccounts()).rejects.toThrow('Unauthorized')
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
    })

    it('should handle network errors', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getAllAccounts()).rejects.toThrow('Network error')
    })

    it('should handle malformed response', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            // Missing username
            role: Role.ADMIN,
          },
        ],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getAllAccounts()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
      expect(result).toEqual([
        {
          role: Role.ADMIN,
        },
      ])
    })

    it('should handle response with additional fields', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            username: 'admin1',
            role: Role.ADMIN,
            email: 'admin1@example.com',
            lastLogin: '2024-01-01T00:00:00Z',
          },
        ],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getAllAccounts()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/auth/getAllAccounts')
      expect(result).toEqual([
        {
          username: 'admin1',
          role: Role.ADMIN,
          email: 'admin1@example.com',
          lastLogin: '2024-01-01T00:00:00Z',
        },
      ])
    })
  })

  describe('createAccount', () => {
    it('should call create account endpoint with correct request data', async () => {
      // Arrange
      const request = {
        username: 'newuser',
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          username: 'newuser',
          password: 'generated-password-123',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newuser',
        password: 'generated-password-123',
      })
    })

    it('should handle create account without role', async () => {
      // Arrange
      const request = {
        username: 'newuser',
      }
      const mockResponse = {
        data: {
          username: 'newuser',
          password: 'generated-password-456',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newuser',
        password: 'generated-password-456',
      })
    })

    it('should handle create account with admin role', async () => {
      // Arrange
      const request = {
        username: 'newadmin',
        role: Role.ADMIN,
      }
      const mockResponse = {
        data: {
          username: 'newadmin',
          password: 'admin-password-789',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newadmin',
        password: 'admin-password-789',
      })
    })

    it('should handle create account with readonly role', async () => {
      // Arrange
      const request = {
        username: 'newreadonly',
        role: Role.READONLY,
      }
      const mockResponse = {
        data: {
          username: 'newreadonly',
          password: 'readonly-password-abc',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newreadonly',
        password: 'readonly-password-abc',
      })
    })

    it('should handle create account API errors', async () => {
      // Arrange
      const request = {
        username: 'existinguser',
        role: Role.DEVELOPER,
      }
      const mockError = new Error('Username already exists')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(createAccount(request)).rejects.toThrow('Username already exists')
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
    })

    it('should handle network errors', async () => {
      // Arrange
      const request = {
        username: 'newuser',
        role: Role.DEVELOPER,
      }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(createAccount(request)).rejects.toThrow('Network error')
    })

    it('should handle empty username', async () => {
      // Arrange
      const request = {
        username: '',
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          username: '',
          password: 'empty-username-password',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: '',
        password: 'empty-username-password',
      })
    })

    it('should handle special characters in username', async () => {
      // Arrange
      const request = {
        username: 'user@domain.com',
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          username: 'user@domain.com',
          password: 'special-username-password',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'user@domain.com',
        password: 'special-username-password',
      })
    })

    it('should handle long username', async () => {
      // Arrange
      const request = {
        username: 'a'.repeat(100),
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          username: 'a'.repeat(100),
          password: 'long-username-password',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'a'.repeat(100),
        password: 'long-username-password',
      })
    })

    it('should handle malformed response', async () => {
      // Arrange
      const request = {
        username: 'newuser',
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          // Missing password
          username: 'newuser',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newuser',
      })
    })

    it('should handle response with additional fields', async () => {
      // Arrange
      const request = {
        username: 'newuser',
        role: Role.DEVELOPER,
      }
      const mockResponse = {
        data: {
          username: 'newuser',
          password: 'generated-password-123',
          createdAt: '2024-01-01T00:00:00Z',
          status: 'active',
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createAccount(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/auth/createAccount', request)
      expect(result).toEqual({
        username: 'newuser',
        password: 'generated-password-123',
        createdAt: '2024-01-01T00:00:00Z',
        status: 'active',
      })
    })
  })
})
