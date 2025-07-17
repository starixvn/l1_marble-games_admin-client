import { API_ENDPOINTS } from './api-endpoints'
import { privateApiClient } from './private.axios'

export type GameIntegrationQuery = {
  gameId: number
  operatorId: string
}

export type GameIntegrationListResponse = {
  operatorId: string
  gameId: number
}

export const listGameIntegration = async () => {
  return privateApiClient.get<GameIntegrationListResponse[]>('/gameIntegration/list')
}

export const getGameIntegration = async ({ gameId, operatorId }: GameIntegrationQuery) => {
  return privateApiClient.get(API_ENDPOINTS.GAME_INTEGRATION.GET, {
    params: {
      gameId,
      operatorId,
    },
  })
}

export const upsertGameIntegration = async ({ query, json }: { query: GameIntegrationQuery; json: object }) => {
  return privateApiClient.post(API_ENDPOINTS.GAME_INTEGRATION.UPSERT, json, {
    params: query,
  })
}

export const deleteGameIntegration = async ({ gameId, operatorId }: GameIntegrationQuery) => {
  return privateApiClient.delete(API_ENDPOINTS.GAME_INTEGRATION.DELETE, {
    params: {
      gameId,
      operatorId,
    },
  })
}
