import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listGameConfigs,
  getGameConfig,
  upsertGameConfig,
  type GameConfigUpsert,
  type GameConfigResponse,
} from '../game-config.api'
import { privateApiClient } from '../private.axios'

// Mock the private axios client
vi.mock('../private.axios', () => ({
  privateApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('Game Config API', () => {
  const mockPrivateApiClient = privateApiClient as unknown as {
    post: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listGameConfigs', () => {
    it('should call list game configs endpoint', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            gameId: 1,
            gameConfigSchema: 'schema1',
            config: { setting1: 'value1' },
          },
          {
            gameId: 2,
            gameConfigSchema: 'schema2',
            config: { setting2: 'value2' },
          },
        ] as GameConfigResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameConfigs()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfig/list')
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty game config list', async () => {
      // Arrange
      const mockResponse = {
        data: [] as GameConfigResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameConfigs()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfig/list')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getGameConfig', () => {
    it('should call get game config endpoint with correct gameId', async () => {
      // Arrange
      const gameId = 1
      const mockResponse = {
        data: {
          gameId: 1,
          gameConfigSchema: 'schema1',
          config: { setting1: 'value1' },
        } as GameConfigResponse,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfig(gameId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfig/get', {
        params: { gameId },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get game config with different gameId', async () => {
      // Arrange
      const gameId = 999
      const mockResponse = {
        data: {
          gameId: 999,
          gameConfigSchema: 'schema999',
          config: { setting999: 'value999' },
        } as GameConfigResponse,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfig(gameId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfig/get', {
        params: { gameId },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get game config with zero gameId', async () => {
      // Arrange
      const gameId = 0
      const mockResponse = {
        data: {
          gameId: 0,
          gameConfigSchema: 'schema0',
          config: { setting0: 'value0' },
        } as GameConfigResponse,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfig(gameId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfig/get', {
        params: { gameId },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('upsertGameConfig', () => {
    it('should call upsert game config endpoint with correct data', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: { setting1: 'value1', setting2: 'value2' },
        query: { gameId: 1, schemaId: 'schema1' },
      }
      const mockResponse = {
        data: {
          gameId: 1,
          gameConfigSchema: 'schema1',
          config: { setting1: 'value1', setting2: 'value2' },
        } as GameConfigResponse,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfig(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfig/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert game config with empty request object', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: {},
        query: { gameId: 1, schemaId: 'schema1' },
      }
      const mockResponse = {
        data: {
          gameId: 1,
          gameConfigSchema: 'schema1',
          config: {},
        } as GameConfigResponse,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfig(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfig/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert game config with complex request object', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: {
          nested: {
            deep: {
              setting: 'value',
              array: [1, 2, 3],
              boolean: true,
              number: 42,
            },
          },
          simple: 'string',
        },
        query: { gameId: 1, schemaId: 'schema1' },
      }
      const mockResponse = {
        data: {
          gameId: 1,
          gameConfigSchema: 'schema1',
          config: upsert.request,
        } as GameConfigResponse,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfig(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfig/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert game config with different gameId and schemaId', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: { setting: 'value' },
        query: { gameId: 999, schemaId: 'schema999' },
      }
      const mockResponse = {
        data: {
          gameId: 999,
          gameConfigSchema: 'schema999',
          config: { setting: 'value' },
        } as GameConfigResponse,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfig(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfig/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('API error handling', () => {
    it('should handle network errors in listGameConfigs', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(listGameConfigs()).rejects.toThrow('Network error')
    })

    it('should handle network errors in getGameConfig', async () => {
      // Arrange
      const gameId = 1
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameConfig(gameId)).rejects.toThrow('Network error')
    })

    it('should handle network errors in upsertGameConfig', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: { setting: 'value' },
        query: { gameId: 1, schemaId: 'schema1' },
      }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameConfig(upsert)).rejects.toThrow('Network error')
    })

    it('should handle 404 errors in getGameConfig', async () => {
      // Arrange
      const gameId = 999
      const mockError = new Error('Not found')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameConfig(gameId)).rejects.toThrow('Not found')
    })

    it('should handle 400 errors in upsertGameConfig', async () => {
      // Arrange
      const upsert: GameConfigUpsert = {
        request: { invalid: 'data' },
        query: { gameId: 1, schemaId: 'schema1' },
      }
      const mockError = new Error('Bad request')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameConfig(upsert)).rejects.toThrow('Bad request')
    })
  })

  describe('Type validation', () => {
    it('should accept valid GameConfigUpsert type', () => {
      // Arrange & Act
      const upsert: GameConfigUpsert = {
        request: { setting: 'value' },
        query: { gameId: 1, schemaId: 'schema1' },
      }

      // Assert
      expect(upsert.request).toBeDefined()
      expect(upsert.query.gameId).toBe(1)
      expect(upsert.query.schemaId).toBe('schema1')
    })

    it('should accept valid GameConfigResponse type', () => {
      // Arrange & Act
      const response: GameConfigResponse = {
        gameId: 1,
        gameConfigSchema: 'schema1',
        config: { setting: 'value' },
      }

      // Assert
      expect(response.gameId).toBe(1)
      expect(response.gameConfigSchema).toBe('schema1')
      expect(response.config).toBeDefined()
    })
  })
})
