import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listGameIntegration,
  getGameIntegration,
  upsertGameIntegration,
  deleteGameIntegration,
  type GameIntegrationQuery,
  type GameIntegrationListResponse,
} from '../game-integration.api'
import { privateApiClient } from '../private.axios'

// Mock the private axios client
vi.mock('../private.axios', () => ({
  privateApiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Game Integration API', () => {
  const mockPrivateApiClient = privateApiClient as unknown as {
    post: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listGameIntegration', () => {
    it('should call list game integration endpoint', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { operatorId: 'op1', gameId: 1 },
          { operatorId: 'op2', gameId: 2 },
        ] as GameIntegrationListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameIntegration()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameIntegration/list')
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty integration list', async () => {
      // Arrange
      const mockResponse = {
        data: [] as GameIntegrationListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameIntegration()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameIntegration/list')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getGameIntegration', () => {
    it('should call get game integration endpoint with correct parameters', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }
      const mockResponse = {
        data: {
          gameId: 1,
          operatorId: 'op1',
          config: { setting1: 'value1' },
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameIntegration/get', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get integration with different parameters', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 999,
        operatorId: 'op999',
      }
      const mockResponse = {
        data: {
          gameId: 999,
          operatorId: 'op999',
          config: { setting999: 'value999' },
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameIntegration/get', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get integration with zero gameId', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 0,
        operatorId: 'op0',
      }
      const mockResponse = {
        data: {
          gameId: 0,
          operatorId: 'op0',
          config: { setting0: 'value0' },
        },
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameIntegration/get', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('upsertGameIntegration', () => {
    it('should call upsert game integration endpoint with correct data', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }
      const json = { setting1: 'value1', setting2: 'value2' }
      const mockResponse = {
        data: {
          gameId: 1,
          operatorId: 'op1',
          config: json,
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameIntegration({ query, json })

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameIntegration/upsert', json, {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert integration with empty json object', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }
      const json = {}
      const mockResponse = {
        data: {
          gameId: 1,
          operatorId: 'op1',
          config: json,
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameIntegration({ query, json })

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameIntegration/upsert', json, {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert integration with complex json object', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }
      const json = {
        nested: {
          deep: {
            setting: 'value',
            array: [1, 2, 3],
            boolean: true,
            number: 42,
          },
        },
        simple: 'string',
      }
      const mockResponse = {
        data: {
          gameId: 1,
          operatorId: 'op1',
          config: json,
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameIntegration({ query, json })

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameIntegration/upsert', json, {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert integration with different gameId and operatorId', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 999,
        operatorId: 'op999',
      }
      const json = { setting: 'value' }
      const mockResponse = {
        data: {
          gameId: 999,
          operatorId: 'op999',
          config: json,
        },
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameIntegration({ query, json })

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameIntegration/upsert', json, {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteGameIntegration', () => {
    it('should call delete game integration endpoint with correct parameters', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }
      const mockResponse = {
        data: { success: true },
      }
      mockPrivateApiClient.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await deleteGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.delete).toHaveBeenCalledWith('/gameIntegration/delete', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle delete integration with different parameters', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 999,
        operatorId: 'op999',
      }
      const mockResponse = {
        data: { success: true },
      }
      mockPrivateApiClient.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await deleteGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.delete).toHaveBeenCalledWith('/gameIntegration/delete', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle delete integration with zero gameId', async () => {
      // Arrange
      const query: GameIntegrationQuery = {
        gameId: 0,
        operatorId: 'op0',
      }
      const mockResponse = {
        data: { success: true },
      }
      mockPrivateApiClient.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await deleteGameIntegration(query)

      // Assert
      expect(mockPrivateApiClient.delete).toHaveBeenCalledWith('/gameIntegration/delete', {
        params: query,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('API error handling', () => {
    it('should handle network errors in listGameIntegration', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(listGameIntegration()).rejects.toThrow('Network error')
    })

    it('should handle network errors in getGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 1, operatorId: 'op1' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameIntegration(query)).rejects.toThrow('Network error')
    })

    it('should handle network errors in upsertGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 1, operatorId: 'op1' }
      const json = { setting: 'value' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameIntegration({ query, json })).rejects.toThrow('Network error')
    })

    it('should handle network errors in deleteGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 1, operatorId: 'op1' }
      const mockError = new Error('Network error')
      mockPrivateApiClient.delete.mockRejectedValue(mockError)

      // Act & Assert
      await expect(deleteGameIntegration(query)).rejects.toThrow('Network error')
    })

    it('should handle 404 errors in getGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 999, operatorId: 'nonexistent' }
      const mockError = new Error('Not found')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameIntegration(query)).rejects.toThrow('Not found')
    })

    it('should handle 400 errors in upsertGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 1, operatorId: 'op1' }
      const json = { invalid: 'data' }
      const mockError = new Error('Bad request')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameIntegration({ query, json })).rejects.toThrow('Bad request')
    })

    it('should handle 404 errors in deleteGameIntegration', async () => {
      // Arrange
      const query: GameIntegrationQuery = { gameId: 999, operatorId: 'nonexistent' }
      const mockError = new Error('Not found')
      mockPrivateApiClient.delete.mockRejectedValue(mockError)

      // Act & Assert
      await expect(deleteGameIntegration(query)).rejects.toThrow('Not found')
    })
  })

  describe('Type validation', () => {
    it('should accept valid GameIntegrationQuery type', () => {
      // Arrange & Act
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'op1',
      }

      // Assert
      expect(query.gameId).toBe(1)
      expect(query.operatorId).toBe('op1')
    })

    it('should accept valid GameIntegrationListResponse type', () => {
      // Arrange & Act
      const response: GameIntegrationListResponse = {
        operatorId: 'op1',
        gameId: 1,
      }

      // Assert
      expect(response.operatorId).toBe('op1')
      expect(response.gameId).toBe(1)
    })

    it('should handle string operatorId in GameIntegrationQuery', () => {
      // Arrange & Act
      const query: GameIntegrationQuery = {
        gameId: 1,
        operatorId: 'operator-123',
      }

      // Assert
      expect(typeof query.operatorId).toBe('string')
      expect(query.operatorId).toBe('operator-123')
    })

    it('should handle number gameId in GameIntegrationQuery', () => {
      // Arrange & Act
      const query: GameIntegrationQuery = {
        gameId: 12345,
        operatorId: 'op1',
      }

      // Assert
      expect(typeof query.gameId).toBe('number')
      expect(query.gameId).toBe(12345)
    })
  })
})
