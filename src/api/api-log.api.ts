import { API_ENDPOINTS } from "./api-endpoints"
import { privateApiClient } from "./private.axios"

export type ApiLogResponseItem = {
  id: string
  request: {
    method: string
    path: string
    query: Record<string, string>
    additionalInfo?: {
      eventId?: number
      gameId?: number
      roundId?: number
    }
  }
  response: {
    statusCode: number
    responseBody: Record<string, unknown>
    responseTime: string
  }
  user: {
    userId: string
  }
  timestamp: string
}

export type ApiLogQuery = {
  startDate: string
  endDate: string
  operator?: string
  endpoint?: string
  gameId?: string
  eventId?: string
}

export const getApiLogs = async (query: ApiLogQuery) => {
  return privateApiClient.get(API_ENDPOINTS.API_LOG, { params: query })
}