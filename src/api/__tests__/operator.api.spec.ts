import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createOperator,
  listOperators,
  getOperator,
  updateOperatorName,
  generatePassword,
  type OperatorListResponse,
} from '../operator.api'
import { privateApiClient } from '../private.axios'

// Mock the private axios client
vi.mock('../private.axios', () => ({
  privateApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('Operator API', () => {
  const mockPrivateApiClient = privateApiClient as unknown as {
    post: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createOperator', () => {
    it('should call create operator endpoint with correct data', async () => {
      // Arrange
      const request = {
        name: 'Test Operator',
      }
      const mockResponse = {
        data: { id: '1', name: 'Test Operator' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createOperator(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/create', request)
      expect(result).toEqual(mockResponse)
    })

    it('should handle create operator with empty name', async () => {
      // Arrange
      const request = {
        name: '',
      }
      const mockResponse = {
        data: { id: '2', name: '' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await createOperator(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/create', request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('listOperators', () => {
    it('should call list operators endpoint', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Operator 1' },
          { id: '2', name: 'Operator 2' },
        ] as OperatorListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listOperators()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/operator/list')
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty operator list', async () => {
      // Arrange
      const mockResponse = {
        data: [] as OperatorListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listOperators()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/operator/list')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getOperator', () => {
    it('should call get operator endpoint with operatorId', async () => {
      // Arrange
      const query = {
        operatorId: '1',
      }
      const mockResponse = {
        data: { id: '1', name: 'Test Operator' },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getOperator(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/operator/get', { params: query })
      expect(result).toEqual(mockResponse)
    })

    it('should call get operator endpoint with name', async () => {
      // Arrange
      const query = {
        name: 'Test Operator',
      }
      const mockResponse = {
        data: { id: '1', name: 'Test Operator' },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getOperator(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/operator/get', { params: query })
      expect(result).toEqual(mockResponse)
    })

    it('should call get operator endpoint with both operatorId and name', async () => {
      // Arrange
      const query = {
        operatorId: '1',
        name: 'Test Operator',
      }
      const mockResponse = {
        data: { id: '1', name: 'Test Operator' },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getOperator(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/operator/get', { params: query })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when neither operatorId nor name is provided', async () => {
      // Arrange
      const query = {}

      // Act & Assert
      await expect(getOperator(query)).rejects.toThrow('operatorId or name is required')
    })

    it('should throw error when both operatorId and name are empty', async () => {
      // Arrange
      const query = {
        operatorId: '',
        name: '',
      }

      // Act & Assert
      await expect(getOperator(query)).rejects.toThrow('operatorId or name is required')
    })
  })

  describe('updateOperatorName', () => {
    it('should call update operator name endpoint with correct data', async () => {
      // Arrange
      const request = {
        name: 'Updated Operator',
        operatorId: '1',
      }
      const mockResponse = {
        data: { id: '1', name: 'Updated Operator' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await updateOperatorName(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/updateName', request)
      expect(result).toEqual(mockResponse)
    })

    it('should handle update operator name with empty name', async () => {
      // Arrange
      const request = {
        name: '',
        operatorId: '1',
      }
      const mockResponse = {
        data: { id: '1', name: '' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await updateOperatorName(request)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/updateName', request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('generatePassword', () => {
    it('should call generate password endpoint with operatorId', async () => {
      // Arrange
      const query = {
        operatorId: '1',
      }
      const mockResponse = {
        data: { password: 'new-password-123' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await generatePassword(query)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/generatePassword', {}, { params: query })
      expect(result).toEqual(mockResponse)
    })

    it('should call generate password endpoint with name', async () => {
      // Arrange
      const query = {
        name: 'Test Operator',
      }
      const mockResponse = {
        data: { password: 'new-password-456' },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await generatePassword(query)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/operator/generatePassword', {}, { params: query })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when neither operatorId nor name is provided', async () => {
      // Arrange
      const query = {}

      // Act & Assert
      await expect(generatePassword(query)).rejects.toThrow('operatorId or name is required')
    })

    it('should throw error when both operatorId and name are empty', async () => {
      // Arrange
      const query = {
        operatorId: '',
        name: '',
      }

      // Act & Assert
      await expect(generatePassword(query)).rejects.toThrow('operatorId or name is required')
    })
  })

  describe('API error handling', () => {
    it('should handle network errors in createOperator', async () => {
      // Arrange
      const request = { name: 'Test Operator' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(createOperator(request)).rejects.toThrow('Network error')
    })

    it('should handle network errors in listOperators', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(listOperators()).rejects.toThrow('Network error')
    })

    it('should handle network errors in getOperator', async () => {
      // Arrange
      const query = { operatorId: '1' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getOperator(query)).rejects.toThrow('Network error')
    })

    it('should handle network errors in updateOperatorName', async () => {
      // Arrange
      const request = { name: 'Updated', operatorId: '1' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(updateOperatorName(request)).rejects.toThrow('Network error')
    })

    it('should handle network errors in generatePassword', async () => {
      // Arrange
      const query = { operatorId: '1' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(generatePassword(query)).rejects.toThrow('Network error')
    })
  })
})
