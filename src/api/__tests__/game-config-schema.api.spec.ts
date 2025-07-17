import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  listGameConfigSchemas,
  getGameConfigSchema,
  upsertGameConfigSchema,
  type GameConfigSchemaListResponse,
  type GameConfigSchema,
  type UpsertGameConfigSchemaFullRequest,
} from '../game-config-schema.api'
import { privateApiClient } from '../private.axios'

// Mock the private axios client
vi.mock('../private.axios', () => ({
  privateApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('Game Config Schema API', () => {
  const mockPrivateApiClient = privateApiClient as unknown as {
    post: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listGameConfigSchemas', () => {
    it('should call list game config schemas endpoint', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: 'schema1', name: 'Test Schema 1' },
          { id: 'schema2', name: 'Test Schema 2' },
        ] as GameConfigSchemaListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameConfigSchemas()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfigSchema/list')
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty schema list', async () => {
      // Arrange
      const mockResponse = {
        data: [] as GameConfigSchemaListResponse[],
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await listGameConfigSchemas()

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfigSchema/list')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getGameConfigSchema', () => {
    it('should call get game config schema endpoint with correct id', async () => {
      // Arrange
      const schemaId = 'schema1'
      const mockResponse = {
        data: {
          name: 'Test Schema',
          schema: { type: 'object', properties: { test: { type: 'string' } } },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfigSchema(schemaId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfigSchema/get', {
        params: { id: schemaId },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get schema with different id', async () => {
      // Arrange
      const schemaId = 'schema999'
      const mockResponse = {
        data: {
          name: 'Another Schema',
          schema: { type: 'object', properties: { another: { type: 'number' } } },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfigSchema(schemaId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfigSchema/get', {
        params: { id: schemaId },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle get schema with empty id', async () => {
      // Arrange
      const schemaId = ''
      const mockResponse = {
        data: {
          name: 'Empty Schema',
          schema: {},
        } as GameConfigSchema,
      }
      mockPrivateApiClient.get.mockResolvedValue(mockResponse)

      // Act
      const result = await getGameConfigSchema(schemaId)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/gameConfigSchema/get', {
        params: { id: schemaId },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('upsertGameConfigSchema', () => {
    it('should call upsert game config schema endpoint with correct data for new schema', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: undefined },
        request: {
          name: 'New Schema',
          schema: { type: 'object', properties: { new: { type: 'string' } } },
        },
      }
      const mockResponse = {
        data: {
          name: 'New Schema',
          schema: { type: 'object', properties: { new: { type: 'string' } } },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfigSchema(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfigSchema/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should call upsert game config schema endpoint with correct data for existing schema', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Updated Schema',
          schema: { type: 'object', properties: { updated: { type: 'string' } } },
        },
      }
      const mockResponse = {
        data: {
          name: 'Updated Schema',
          schema: { type: 'object', properties: { updated: { type: 'string' } } },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfigSchema(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfigSchema/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert schema with uiSchema', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Schema with UI',
          schema: { type: 'object', properties: { field: { type: 'string' } } },
          uiSchema: { field: { 'ui:widget': 'textarea' } },
        },
      }
      const mockResponse = {
        data: {
          name: 'Schema with UI',
          schema: { type: 'object', properties: { field: { type: 'string' } } },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfigSchema(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfigSchema/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert schema with complex schema object', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Complex Schema',
          schema: {
            type: 'object',
            properties: {
              nested: {
                type: 'object',
                properties: {
                  deep: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        value: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }
      const mockResponse = {
        data: {
          name: 'Complex Schema',
          schema: upsert.request.schema,
        } as GameConfigSchema,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfigSchema(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfigSchema/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle upsert schema with empty name', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: '',
          schema: { type: 'object' },
        },
      }
      const mockResponse = {
        data: {
          name: '',
          schema: { type: 'object' },
        } as GameConfigSchema,
      }
      mockPrivateApiClient.post.mockResolvedValue(mockResponse)

      // Act
      const result = await upsertGameConfigSchema(upsert)

      // Assert
      expect(mockPrivateApiClient.post).toHaveBeenCalledWith('/gameConfigSchema/upsert', upsert.request, {
        params: upsert.query,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('API error handling', () => {
    it('should handle network errors in listGameConfigSchemas', async () => {
      // Arrange
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(listGameConfigSchemas()).rejects.toThrow('Network error')
    })

    it('should handle network errors in getGameConfigSchema', async () => {
      // Arrange
      const schemaId = 'schema1'
      const mockError = new Error('Network error')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameConfigSchema(schemaId)).rejects.toThrow('Network error')
    })

    it('should handle network errors in upsertGameConfigSchema', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Test Schema',
          schema: { type: 'object' },
        },
      }
      const mockError = new Error('Network error')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameConfigSchema(upsert)).rejects.toThrow('Network error')
    })

    it('should handle 404 errors in getGameConfigSchema', async () => {
      // Arrange
      const schemaId = 'nonexistent'
      const mockError = new Error('Not found')
      mockPrivateApiClient.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getGameConfigSchema(schemaId)).rejects.toThrow('Not found')
    })

    it('should handle 400 errors in upsertGameConfigSchema', async () => {
      // Arrange
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Invalid Schema',
          schema: { invalid: 'schema' },
        },
      }
      const mockError = new Error('Bad request')
      mockPrivateApiClient.post.mockRejectedValue(mockError)

      // Act & Assert
      await expect(upsertGameConfigSchema(upsert)).rejects.toThrow('Bad request')
    })
  })

  describe('Type validation', () => {
    it('should accept valid GameConfigSchemaListResponse type', () => {
      // Arrange & Act
      const response: GameConfigSchemaListResponse = {
        id: 'schema1',
        name: 'Test Schema',
      }

      // Assert
      expect(response.id).toBe('schema1')
      expect(response.name).toBe('Test Schema')
    })

    it('should accept valid GameConfigSchema type', () => {
      // Arrange & Act
      const schema: GameConfigSchema = {
        name: 'Test Schema',
        schema: { type: 'object', properties: { test: { type: 'string' } } },
      }

      // Assert
      expect(schema.name).toBe('Test Schema')
      expect(schema.schema).toBeDefined()
    })

    it('should accept valid UpsertGameConfigSchemaFullRequest type', () => {
      // Arrange & Act
      const upsert: UpsertGameConfigSchemaFullRequest = {
        query: { id: 'schema1' },
        request: {
          name: 'Test Schema',
          schema: { type: 'object' },
          uiSchema: { field: { 'ui:widget': 'input' } },
        },
      }

      // Assert
      expect(upsert.query.id).toBe('schema1')
      expect(upsert.request.name).toBe('Test Schema')
      expect(upsert.request.schema).toBeDefined()
      expect(upsert.request.uiSchema).toBeDefined()
    })
  })
})
