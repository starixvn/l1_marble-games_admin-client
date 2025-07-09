import { vi } from 'vitest'

vi.mock('@/api/private.axios', () => ({
  privateApiClient: {
    get: vi.fn(),
  },
}))

import { getAdminLogs, type AdminLogQuery } from '../admin-log.api'
import { privateApiClient } from '@/api/private.axios'

describe('admin-log.api', () => {
  const mockPrivateApiClient = privateApiClient as unknown as { get: ReturnType<typeof vi.fn> }

  const mockQuery: AdminLogQuery = {
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-01-01T01:00:00.000Z',
    author: 'admin',
    resource: 'operator',
    action: 'insert',
  }

  const mockResponse = {
    data: {
      data: [
        {
          id: '1',
          author: 'admin',
          resource: 'operator',
          action: 'insert',
          timestamp: '2024-01-01T00:00:00.000Z',
          diff: {
            old: { name: 'old value' },
            new: { name: 'new value' }
          }
        },
        {
          id: '2',
          author: 'admin',
          resource: 'game-config',
          action: 'update',
          timestamp: '2024-01-01T01:00:00.000Z',
          diff: {
            old: { config: 'old config' },
            new: { config: 'new config' }
          }
        }
      ]
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPrivateApiClient.get.mockResolvedValue(mockResponse)
  })

  describe('getAdminLogs', () => {
    it('should call privateApiClient.get with correct endpoint and parameters', async () => {
      // Arrange
      // Act
      await getAdminLogs(mockQuery)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: mockQuery })
    })

    it('should return the response from privateApiClient.get', async () => {
      // Arrange
      // Act
      const result = await getAdminLogs(mockQuery)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    it('should handle query with all parameters', async () => {
      // Arrange
      const fullQuery: AdminLogQuery = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
        author: 'admin',
        resource: 'operator',
        action: 'insert',
      }

      // Act
      await getAdminLogs(fullQuery)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: fullQuery })
    })

    it('should handle query with only required parameters', async () => {
      // Arrange
      const requiredOnlyQuery: AdminLogQuery = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
      }

      // Act
      await getAdminLogs(requiredOnlyQuery)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: requiredOnlyQuery })
    })

    it('should handle query with undefined optional parameters', async () => {
      // Arrange
      const queryWithUndefined: AdminLogQuery = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
        author: undefined,
        resource: undefined,
        action: undefined,
      }

      // Act
      await getAdminLogs(queryWithUndefined)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: queryWithUndefined })
    })

    it('should handle different date ranges', async () => {
      // Arrange
      const differentDateQuery: AdminLogQuery = {
        startDate: '2024-01-02T12:00:00.000Z',
        endDate: '2024-01-02T18:00:00.000Z',
        author: 'user123',
        resource: 'game-config',
        action: 'update',
      }

      // Act
      await getAdminLogs(differentDateQuery)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: differentDateQuery })
    })

    it('should handle empty response', async () => {
      // Arrange
      const emptyResponse = { data: { data: [] } }
      mockPrivateApiClient.get.mockResolvedValue(emptyResponse)

      // Act
      const result = await getAdminLogs(mockQuery)

      // Assert
      expect(result).toEqual(emptyResponse)
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: mockQuery })
    })

    it('should handle API error', async () => {
      // Arrange
      const apiError = new Error('API Error')
      mockPrivateApiClient.get.mockRejectedValue(apiError)

      // Act & Assert
      await expect(getAdminLogs(mockQuery)).rejects.toThrow('API Error')
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: mockQuery })
    })

    it('should handle network error', async () => {
      // Arrange
      const networkError = new Error('Network Error')
      mockPrivateApiClient.get.mockRejectedValue(networkError)

      // Act & Assert
      await expect(getAdminLogs(mockQuery)).rejects.toThrow('Network Error')
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: mockQuery })
    })

    it('should handle different resource types', async () => {
      // Arrange
      const resourceQueries = [
        { resource: 'operator' },
        { resource: 'game-config' },
        { resource: 'game-config-schema' },
        { resource: 'game-integration' },
      ]

      // Act & Assert
      for (const resourceQuery of resourceQueries) {
        const query = {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-01-01T01:00:00.000Z',
          ...resourceQuery,
        }
        
        await getAdminLogs(query)
        expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: query })
      }
    })

    it('should handle different action types', async () => {
      // Arrange
      const actionQueries = [
        { action: 'insert' },
        { action: 'update' },
        { action: 'delete' },
      ]

      // Act & Assert
      for (const actionQuery of actionQueries) {
        const query = {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-01-01T01:00:00.000Z',
          ...actionQuery,
        }
        
        await getAdminLogs(query)
        expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: query })
      }
    })

    it('should handle complex query parameters', async () => {
      // Arrange
      const complexQuery: AdminLogQuery = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T23:59:59.999Z',
        author: 'admin',
        resource: 'game-config',
        action: 'update',
      }

      // Act
      await getAdminLogs(complexQuery)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledWith('/adminLog/', { params: complexQuery })
    })

    it('should handle multiple calls with different parameters', async () => {
      // Arrange
      const query1: AdminLogQuery = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
        author: 'admin',
      }

      const query2: AdminLogQuery = {
        startDate: '2024-01-02T00:00:00.000Z',
        endDate: '2024-01-02T01:00:00.000Z',
        resource: 'operator',
      }

      // Act
      await getAdminLogs(query1)
      await getAdminLogs(query2)

      // Assert
      expect(mockPrivateApiClient.get).toHaveBeenCalledTimes(2)
      expect(mockPrivateApiClient.get).toHaveBeenNthCalledWith(1, '/adminLog/', { params: query1 })
      expect(mockPrivateApiClient.get).toHaveBeenNthCalledWith(2, '/adminLog/', { params: query2 })
    })
  })


})
