import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getApiLogs, type ApiLogQuery, type ApiLogResponseItem } from '../api-log.api'
import type { AxiosResponse } from 'axios'

// Mock the private API client
vi.mock('../private.axios', () => ({
  privateApiClient: {
    get: vi.fn(),
  },
}))

// Import the mocked client
import { privateApiClient } from '../private.axios'

const mockGet = vi.mocked(privateApiClient.get)

describe('api-log.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getApiLogs', () => {
    it('should call privateApiClient.get with correct parameters and return data', async () => {
      // Arrange
      const mockQuery: ApiLogQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        operator: 'test-operator',
        endpoint: '/api/test',
        gameId: '123',
        eventId: '456',
      }

      const mockApiLogs: ApiLogResponseItem[] = [
        {
          id: '1',
          request: {
            method: 'GET',
            path: '/api/test',
            query: { test: 'value' },
            additionalInfo: {
              eventId: 456,
              gameId: 123,
              roundId: 1,
            },
          },
          response: {
            statusCode: 200,
            responseBody: { success: true },
            responseTime: '2024-01-01T10:00:00Z',
          },
          user: {
            userId: 'user-1',
          },
          timestamp: '2024-01-01T10:00:00Z',
        },
      ]

      const mockResponse: AxiosResponse<ApiLogResponseItem[]> = {
        data: mockApiLogs,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as AxiosResponse<ApiLogResponseItem[]>['config'],
      }

      mockGet.mockResolvedValue(mockResponse)

      // Act
      const result = await getApiLogs(mockQuery)

      // Assert
      expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
        params: mockQuery,
      })
      expect(result).toEqual(mockResponse)
      expect(result.data).toEqual(mockApiLogs)
    })

    it('should handle query with only required parameters', async () => {
      // Arrange
      const mockQuery: ApiLogQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        // Optional parameters omitted
      }

      const mockApiLogs: ApiLogResponseItem[] = []
      const mockResponse: AxiosResponse<ApiLogResponseItem[]> = {
        data: mockApiLogs,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as AxiosResponse<ApiLogResponseItem[]>['config'],
      }

      mockGet.mockResolvedValue(mockResponse)

      // Act
      const result = await getApiLogs(mockQuery)

      // Assert
      expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
        params: mockQuery,
      })
      expect(result.data).toEqual(mockApiLogs)
    })

    it('should handle empty response', async () => {
      // Arrange
      const mockQuery: ApiLogQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      }

      const mockResponse: AxiosResponse<ApiLogResponseItem[]> = {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as AxiosResponse<ApiLogResponseItem[]>['config'],
      }

      mockGet.mockResolvedValue(mockResponse)

      // Act
      const result = await getApiLogs(mockQuery)

      // Assert
      expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
        params: mockQuery,
      })
      expect(result.data).toEqual([])
    })

    it('should handle API error', async () => {
      // Arrange
      const mockQuery: ApiLogQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      }

      const mockError = new Error('API Error')
      mockGet.mockRejectedValue(mockError)

      // Act & Assert
      await expect(getApiLogs(mockQuery)).rejects.toThrow('API Error')
      expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
        params: mockQuery,
      })
    })

    it('should handle different query parameter combinations', async () => {
      // Arrange
      const testCases: Array<{ query: ApiLogQuery; description: string }> = [
        {
          query: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            operator: 'operator1',
          },
          description: 'with operator only',
        },
        {
          query: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            endpoint: '/api/events',
          },
          description: 'with endpoint only',
        },
        {
          query: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            gameId: '1001',
            eventId: '2001',
          },
          description: 'with gameId and eventId',
        },
        {
          query: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            operator: 'operator1',
            endpoint: '/api/events',
            gameId: '1001',
            eventId: '2001',
          },
          description: 'with all parameters',
        },
      ]

      const mockResponse: AxiosResponse<ApiLogResponseItem[]> = {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as AxiosResponse<ApiLogResponseItem[]>['config'],
      }

      mockGet.mockResolvedValue(mockResponse)

      // Act & Assert
      for (const testCase of testCases) {
        vi.clearAllMocks()
        
        const result = await getApiLogs(testCase.query)
        
        expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
          params: testCase.query,
        })
        expect(result).toEqual(mockResponse)
      }
    })

    it('should preserve query parameter types correctly', async () => {
      // Arrange
      const mockQuery: ApiLogQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        operator: 'test-operator',
        endpoint: '/api/test',
        gameId: '123',
        eventId: '456',
      }

      const mockResponse: AxiosResponse<ApiLogResponseItem[]> = {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as AxiosResponse<ApiLogResponseItem[]>['config'],
      }

      mockGet.mockResolvedValue(mockResponse)

      // Act
      await getApiLogs(mockQuery)

      // Assert
      expect(mockGet).toHaveBeenCalledWith('/apiLog/', {
        params: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          operator: 'test-operator',
          endpoint: '/api/test',
          gameId: '123',
          eventId: '456',
        },
      })
      
      // Verify that the params object has the correct structure
      const callArgs = mockGet.mock.calls[0]
      const params = callArgs[1]?.params as ApiLogQuery
      
      expect(params.startDate).toBe('2024-01-01')
      expect(params.endDate).toBe('2024-01-31')
      expect(params.operator).toBe('test-operator')
      expect(params.endpoint).toBe('/api/test')
      expect(params.gameId).toBe('123')
      expect(params.eventId).toBe('456')
    })
  })
})
